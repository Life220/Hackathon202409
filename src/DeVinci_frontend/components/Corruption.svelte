<script lang="ts">
    import { onMount } from "svelte";
  
  // export let sendMessageCallbackFunction;

  import Quiz from "./CorruptionQuizFormatter.svelte";
  import QuizNav from "./quizNav.svelte";

  let initialPage = true;

  function quizMe()
  {
    initialPage = false;
  }
  // function sendMessage(message) {
  //   sendMessageCallbackFunction(message);
  // };

  // Topics
</script>

<div>
  <QuizNav currentComponent="Corruption" />
  <div class="flex flex-col justify-center w-full items-center">
    {#if initialPage}
      <h1 class="text-white mb-3 border-b-2 border-dotted border-white w-full text-center text-3xl">Corruption</h1>
      <h2 class="text-white text-xl mb-1.5">Scenario based questions</h2>
      <p class="text-white mb-10">You will be given scenarios and asked questions based on it.
        Not every answer is 100% correct or incorred but you will be marked according to ethics and morals from your answer.</p>
      <button class="text-white border-2 p-3" on:click={quizMe}>Quiz me</button>
    {:else}
      <Quiz subject="Corruption" />
    {/if}
    <div class="flex flex-col gap-4 w-full">
      
    </div>
  </div>
</div>