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

    let worker: Worker;
    let prompt = '';
    let results = writable<any[]>([]);
    let userAnswers = writable<string[]>([]);
    let marks = writable<boolean[]>([]);

    // onMount(() => {
    //     worker = new Worker('/src/DeVinci_frontend/assets/worker.ts');
    //     worker.onmessage = (event) => {
    //         results.update(msgs => [...msgs, { name: 'DeVinci', content: event.data }]);
    //     }
    //     console.log("Test");
    // });


    function sendUserAnswers()
    {
      const givenAnswers = getStoreValue(userAnswers);
      console.log("Submitted answers: ", givenAnswers);
      
      const calculatedAnswers = calculateAnswers();
      const doubleUserAnswers = givenAnswers.map(answer => parseFloat(answer));
      console.log("After calculation: " + calculatedAnswers);
      checkAnswers(calculatedAnswers, doubleUserAnswers);
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
        quizFormatter(reply);
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

  let questions = writable<string[]>([]);
  // Format the response from the AI as a quiz
  async function quizFormatter(latestResult: string)
  {
    // console.log(latestResult);
    if (latestResult)
    {
      const doubleQuoteRegex = /"([^"]+)"/g;
      const singleQuoteRegex = /'([^']+)'/g;
      let matches = [];
      let match;

      while ((match = doubleQuoteRegex.exec(latestResult)) !== null)
        matches.push(match[1])
  
      // Extract and log content between single quotes
      while ((match = singleQuoteRegex.exec(latestResult)) !== null)
        matches.push(match[1])

      let formattedQuestions = matches.map(m => {
        let cleaned = m.replace(/[^0-9+=]/g, '');
        let beforeEqual = cleaned.split('=')[0];
        let spaced = beforeEqual.replace(/([0-9])([+=])/g, '$1 $2').replace(/([+=])([0-9])/g, '$1 $2');
        return spaced;
      });
      questions.set(formattedQuestions);
    }
  }

  function back()
  {
    // Do nothing
  }
</script>

<div class="w-full">
  <img src={arrow} alt="|" class="back">
  <button class="btnBack" on:click={back}>Quiz</button>
  
  <div class="flex flex-col justify-center w-full items-center">
    <h1 class="text-white mb-3 border-b-2 border-dotted border-white w-full text-center text-3xl">Quiz</h1>
    <div class="quiz">
        {#each $questions as question, index}
        <div class="questions">
            <p>{index + 1}.</p>
            {question}
            <p style="border-1"> = </p>
            <input type="text" class="response" bind:value={$userAnswers[index]} class:correct={$marks.length > 0 && $marks[index]} class:incorrect={$marks.length > 0 && !$marks[index]} readonly={$marks.length > 0}/>
        </div>
      {/each}
      </div>
      <button on:click={sendUserAnswers}>Submit</button>

      <div id="Quiz">
        <MakeQuiz modelCallbackFunction={getResponse} chatDisplayed={$activeChatGlobal} callbackSearchVectorDbTool={setVectorDbSearchTool} given={"Math"}/>
    </div>
      <!-- <div id="chatinterface" class="flex flex-col p-4 pb-24 max-w-3xl mx-auto w-full">
        {#if !$chatModelIdInitiatedGlobal}
          <SelectModel onlyShowDownloadedModels={true} autoInitiateSelectedModel={true}/>
        {:else if isChatBoxReady}
          {#key $activeChatGlobal}
            <ChatBox modelCallbackFunction={getChatModelResponse} chatDisplayed={$activeChatGlobal} callbackSearchVectorDbTool={setVectorDbSearchTool}/>
          {/key}
        {:else}
          <p>Loading chat interface...</p>
        {/if}
      </div> -->
  </div>
</div>

<style>
    .questions
    {
        background-color: white;
        border: 2px dotted;
        border-radius: 10%;
        padding: 20px;
        margin: 20px;
    }

    .response
    {
        border: 1px solid black;
        padding: 5px;
    }

    .correct
    {
      border-color: green;
      
    }

    .incorrect
    {
      border-color: red;
    }
</style>