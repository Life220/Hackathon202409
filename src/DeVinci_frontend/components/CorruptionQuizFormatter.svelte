<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    import { writable, get as getStoreValue } from "svelte/store";
    import Message from "./Message.svelte";
    import {
    chatModelGlobal,
    activeChatGlobal,
    chatModelIdInitiatedGlobal,
    } from "../store";
    import InstallToastNotification from './InstallToastNotification.svelte'; //TODO: move
    import {
        getSearchVectorDbTool,
        //storeEmbeddings,
        //loadExistingVectorStore,
        //checkUserHasKnowledgeBase
    } from "../helpers/vector_database";
    import SelectModel from "./SelectModel.svelte";
    import MakeQuiz from "./MakeQuiz.svelte";
    import { userHasDownloadedModel } from "../helpers/localStorage";
    import { get } from "http";
    import { slice } from "@tensorflow/tfjs-core";
    import arrow from "../assets/arrow.png";

    // Reactive statement to check if the user has already downloaded at least one AI model
    $: userHasDownloadedAtLeastOneModel = userHasDownloadedModel();

    export let subject: string;
    let worker: Worker;
    let prompt = '';
    let results = writable<any[]>([]);
    let userAnswer: String;
    let marks = writable<boolean[]>([]);
      const key = writable(0);

    // onMount(() => {
    //     worker = new Worker('/src/DeVinci_frontend/assets/worker.ts');
    //     worker.onmessage = (event) => {
    //         results.update(msgs => [...msgs, { name: 'DeVinci', content: event.data }]);
    //     }
    //     console.log("Test");
    // });

    let finalPrompt: string;
    function sendUserAnswer()
    {
        console.log("Submitted answers: ", userAnswer);
        finalPrompt = "Given a Scenario: " +
        Scenario + " and a Wuestion: " +
        Question + "\n and an answer: \n" +
        userAnswer +
        "\n How valid is the answer given according to morals and ethics? (Only give points in a single sentence each)";

        console.log(finalPrompt);
    }

    function checkAnswers(calculatedAnswers: number[], doubledUserAnswers: number[])
    {
      let marksArr = [];

      calculatedAnswers.forEach((answer, index) => {
        if (index < doubledUserAnswers.length)
        {
          if (answer == doubledUserAnswers[index])
            marksArr.push(true);
          else
            marksArr.push(false);
        }
        else
          marksArr.push(false);
      });
      marks.set(marksArr);
    }

    function calculateAnswers()
    {
        //Check
        const currentQuestions = getStoreValue(questions);
        let calculatedAnswers = [];

        currentQuestions.forEach(question => {
            let variables = [];
            let signs = [];
            let currentVariable = '';
            let finalResult;

            for (let k = 0; k < question.length; k++)
            {
                const char = question[k];
                if (!isNaN(parseFloat(char)))
                {
                    currentVariable += char;
                }
                else if (char != ' ')
                {
                    if (currentVariable)
                    {
                        variables.push(parseFloat(currentVariable));
                        currentVariable = '';
                    }
                    signs.push(char);
                }
            }
            if (currentVariable)
                variables.push(parseFloat(currentVariable));

            // Create expression
            let expression = variables[0].toString();
            for (let k = 0; k < signs.length; k++)
            {
                expression += `${signs[k]} ${variables[k+1]}`;
            }

            // Evaluate the expression
            try
            {
                finalResult = new Function(`return ${expression}`)();
                calculatedAnswers.push(finalResult);
            }
            catch (error)
            {
                console.error(`Error evaluating expression: ${expression}`);
                console.error(error);
            }
        });

        return calculatedAnswers;
    }

    let vectorDbSearchTool;
    let useKnowledgeBase = false;

  async function setVectorDbSearchTool(pathToInput) {
    vectorDbSearchTool = await getSearchVectorDbTool(pathToInput);
    useKnowledgeBase = true;
  };

  function setLabel(id: string, text: string) {
    const label = document.getElementById(id);
    if (label == null) {
      throw Error("Cannot find label " + id);
    }
    label.innerText = text;
  };

  const generateProgressCallback = (_step: number, message: string) => {
    setLabel("generate-label", message);
  };

  // Receive response from chatbot
  async function getResponse(prompt, progressCallback = generateProgressCallback) {
    try {
      /* debugOutput = "###in getChatModelResponse###";
      debugOutput += JSON.stringify(prompt);
      setLabel("debug-label", debugOutput); */
      if (vectorDbSearchTool && useKnowledgeBase) {
        /* debugOutput += " useKnowledgeBase ";
        setLabel("debug-label", debugOutput); */
        // Add content from local knowledge base if activated
        let additionalContentToProvide = "";
        additionalContentToProvide = " Additional content (use this if relevant to the User Prompt): ";
        try {
          const promptContent = prompt[prompt.length - 1].content;
          let vectorDbSearchToolResponse = await vectorDbSearchTool.func(promptContent);
          vectorDbSearchToolResponse = JSON.parse(vectorDbSearchToolResponse);
          try {
            for (let index = 0; index < vectorDbSearchToolResponse.existingChatsFoundInLocalDatabase.length; index++) {
              const additionalEntry = vectorDbSearchToolResponse.existingChatsFoundInLocalDatabase[index];
              additionalContentToProvide += "  ";
              additionalContentToProvide += additionalEntry.content;
            };
            // Compose the final prompt
            const additionalContentEntry = { role: 'user', content: additionalContentToProvide, name: 'UserKnowledgeBase' };
            prompt = [...prompt, additionalContentEntry];
          } catch (error) {
            console.error("Error in getQuizModelResponse final prompt and additionalContentEntry");
            console.error(error.toString());
            /* debugOutput += " final prompt and additionalContentEntry error ";
            debugOutput += error.toString();
              debugOutput += error.name;
              debugOutput += error.message;
            setLabel("debug-label", debugOutput);  */
          };
        } catch (error) {
          console.error("Error in getQuizModelResponse getting vectorDbSearchToolResponse");
          console.error(error.toString());
          /* debugOutput += " vectorDbSearchToolResponse error ";
          debugOutput += error.toString();
              debugOutput += error.name;
              debugOutput += error.message;
          setLabel("debug-label", debugOutput);   */
        };
      };

      try {
        /* debugOutput += " final prompt ";
        debugOutput += JSON.stringify(prompt);
        setLabel("debug-label", debugOutput); */
        let curMessage = "";
        let stepCount = 0;
        const completion = await $chatModelGlobal.chat.completions.create({ stream: true, messages: prompt });
        /* debugOutput += " completion ";
        debugOutput += JSON.stringify(completion);
        setLabel("debug-label", debugOutput); */
        try {
          for await (const chunk of completion) {
            /* debugOutput += " chunk ";
            debugOutput += JSON.stringify(chunk);
            setLabel("debug-label", debugOutput); */
            try {
              const curDelta = chunk.choices[0].delta.content;
              if (curDelta) {
                curMessage += curDelta;
              };
              progressCallback(stepCount, curMessage);
              stepCount ++;
            } catch (error) {
              console.error("Error in getQuizModelResponse progressCallback");
              console.error(error.toString());
              /* debugOutput += " progressCallback error ";
              debugOutput += error.toString();
              debugOutput += error.name;
              debugOutput += error.message;
              setLabel("debug-label", debugOutput);  */
            };
          };
        } catch (error) {
          console.error("Error in getQuizModelResponse completion loop");
          console.error(error.toString());
          /* debugOutput += " completion loop error ";
          debugOutput += error.toString();
          debugOutput += error.name;
          debugOutput += error.message;
          setLabel("debug-label", debugOutput);  */
        };
      } catch (error) {
        console.error("Error in getResponse completion (Quiz)");
        console.error(error.toString());
        /* debugOutput += " completion error ";
        debugOutput += error.toString();
              debugOutput += error.name;
              debugOutput += error.message;
        setLabel("debug-label", debugOutput);  */
      };

      try {
        /* debugOutput += " before getMessage ";
        setLabel("debug-label", debugOutput); */
        const reply = await $chatModelGlobal.getMessage();
        /* debugOutput += " reply ";
        debugOutput += reply;
        setLabel("debug-label", debugOutput); */
        if (!finalPrompt)
            quizFormatter(reply);
        else
            finalResponseFormatter(reply);
        return reply;
      } catch (error) {
        console.error("Error in getResponse reply (Quiz)");
        console.error(error.toString());
        /* debugOutput += " reply error ";
        debugOutput += error.toString();
              debugOutput += error.name;
              debugOutput += error.message;
        setLabel("debug-label", debugOutput);    */
      };
    } catch (error) {
      console.error("Error in getResponse (Quiz)");
      console.error(error.toString());
      /* debugOutput += " outer error ";
      debugOutput += error.toString();
              debugOutput += error.name;
              debugOutput += error.message;
      setLabel("debug-label", debugOutput);   */
    };
    // if no reply was returned, an error occurred
    throw new Error('An error occurred');
  };

  let Scenario;
  let Question;
  // Format the response from the AI as a quiz
  async function quizFormatter(latestResult: string)
  {
    // console.log(latestResult);
    if (latestResult)
    {
        // Split the string at "Scenario" and "Question" (case insensitive)
        const scenarioRegex = /scenario:|question:/i;
        const split = latestResult?.replace(/\*/g, '').trim().split(scenarioRegex);

        Scenario = split[1];
        Question= split[2];
    }
  }

  let finalResponse: string;
  async function finalResponseFormatter(latestResult:string)
  {
    finalResponse = latestResult;
  }

    // Function to reset the component
  function resetComponent()
  {
    Scenario = "";
    Question = "";
    finalResponse = ""
    key.update(n => n + 1);
  }

  function back()
  {
    // Do nothing
  }
</script>

{#key $key}
<div class=" w-full">
  <img src={arrow} alt="|" class="back">
  <button class="btnBack" on:click={back}>Quiz</button>
  <div class="flex flex-col justify-center w-full items-center">

    <h1 class="text-white mb-3 border-b-2 border-dotted border-white w-full text-center text-3xl">Quiz</h1>
    <div class="quiz">
        <div class="questions">
            {#if Scenario && Question}
                <p class="bold">Scenario:</p>
                {Scenario}
                <p class="bold mt-2">Question:</p>
                {Question}
                <p class="bold mt-5">Answer:</p>
                <textarea class="response" bind:value={userAnswer} />
            {:else}
                <p>Loading</p>
            {/if}
            {#if finalResponse}
                <p class="bold mt-5">Results:</p>
                <p>{finalResponse}</p>
            {/if}
        </div>
      </div>
      {#if Scenario && Question}
        {#if !finalResponse}
          <button class="submit" on:click={sendUserAnswer}>Submit</button>
        {/if}
        <button class="submit" on:click={resetComponent}>New Quiz</button>
      {/if}
  
      <div id="Quiz">
        {#if !finalPrompt}
            <MakeQuiz modelCallbackFunction={getResponse} chatDisplayed={$activeChatGlobal} callbackSearchVectorDbTool={setVectorDbSearchTool} given={subject}/>
        {:else}
            <MakeQuiz modelCallbackFunction={getResponse} chatDisplayed={$activeChatGlobal} callbackSearchVectorDbTool={setVectorDbSearchTool} given={finalPrompt}/>
        {/if}
    </div>
  </div>
</div>
{/key}

<style>
    .questions
    {
        background-color: white;
        border: 2px dotted;
        border-radius: 10%;
        padding: 20px;
        margin: 20px;
    }

    .bold
    {
        font-weight: bold;
    }

    .response
    {
        border: 1px solid black;
        padding: 5px;
        width: 100%;
        resize: vertical;
        min-height: 2.3rem;
    }

    .submit
    {
        background-color: white;
        border: 2px dotted;
        border-radius: 10%;
        padding: 20px;
        margin-bottom: 20px;
    }
</style>