<script lang="ts">
    import { Empty } from "@dfinity/candid/lib/cjs/idl";
    import MathQuizFormatter from "./MathQuizFormatter.svelte"; 
    import { Add, string } from "@tensorflow/tfjs-core";
    import { writable } from "svelte/store";
    import QuizNav from "./quizNav.svelte";

    let makeQuiz = false;
    // Topics
    const Addition = 'Addition';
    const Subtraction = 'Subtraction';
    const Multiplication = 'Multiplication';
    const Division = 'Division';
    const Square = 'Square';
    const Cube = 'Cube';
    const Power = 'Power';

    let topics = writable<string[]>([]);
    function handleTopic(topic: string)
    {
        topics.update(currentTopics => {
            if (currentTopics.includes(topic))
                return currentTopics.filter(t => t !== topic);
            else
                return [...currentTopics, topic];
        });
    }

    function quizMe()
    {
        makeQuiz = true;
        console.log("Selected: " + $topics);
    }

</script>

<div>
  {#if makeQuiz}
    <MathQuizFormatter />
  {:else}
    <QuizNav />
    <h1 class="text-white mb-3 border-b-2 border-dotted border-white w-full text-center text-3xl">Select a Topic</h1>

    <div class="flex flex-col gap-4 w-full">
      <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#f9c490] rounded-lg cursor-pointer"
        class:selected={$topics.includes(Addition)}
        on:click={() => handleTopic('Addition')}>
        <div class="inline-flex items-center justify-between w-full p-3">
          <p class="w-full text-[#151b1e] text-sm font-normal">{Addition} (+)</p>
        </div>
      </div>

      <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#a1c490] rounded-lg cursor-pointer"
        class:selected={$topics.includes(Subtraction)}
        on:click={() => handleTopic('Subtraction')}>
        <div class="inline-flex items-center justify-between w-full p-3">
          <p class="w-full text-[#151b1e] text-sm font-normal">{Subtraction} (-)</p>
        </div>
      </div>

      <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#a1c490] rounded-lg cursor-pointer"
        class:selected={$topics.includes(Multiplication)}
        on:click={() => handleTopic('Multiplication')}>
        <div class="inline-flex items-center justify-between w-full p-3">
          <p class="w-full text-[#151b1e] text-sm font-normal">{Multiplication} (x)</p>
        </div>
      </div>

      <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#f0e68c] rounded-lg cursor-pointer"
        class:selected={$topics.includes(Division)}
        on:click={() => handleTopic('Division')}>
        <div class="inline-flex items-center justify-between w-full p-3">
          <p class="w-full text-[#151b1e] text-sm font-normal">{Division} (÷)</p>
        </div>
      </div>

      <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#cb8bd0] rounded-lg cursor-pointer disabled"
        class:selected={$topics.includes(Square)}
        on:click={() => handleTopic('Square')}>
        <div class="inline-flex items-center justify-between w-full p-3">
          <p class="w-full text-[#151b1e] text-sm font-normal">{Square} (x²)</p>
        </div>
      </div>

      <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#cb8bd0] rounded-lg cursor-pointer disabled"
        class:selected={$topics.includes(Cube)}
        on:click={() => handleTopic('Cube')}>
        <div class="inline-flex items-center justify-between w-full p-3">
          <p class="w-full text-[#151b1e] text-sm font-normal">{Cube} (x³)</p>
        </div>
      </div>

      <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#cb8bd0] rounded-lg cursor-pointer disabled"
        class:selected={$topics.includes(Power)}
        on:click={() => handleTopic('Power')}>
        <div class="inline-flex items-center justify-between w-full p-3">
          <p class="w-full text-[#151b1e] text-sm font-normal">{Power} (xⁿ)</p>
        </div>
      </div>
      <button class="text-white border-2 p-3 w-36 self-center" on:click={quizMe}>Quiz me</button>
    </div>
  {/if}
</div>

<style>
    .selected
    {
        background-color: #002e699f;
    }

    .selected p
    {
        color: white;
    }

</style>