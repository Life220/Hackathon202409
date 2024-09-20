<script lang="ts">  
    // export let sendMessageCallbackFunction;

    import Quiz from "./Quiz.svelte";

  
    // function sendMessage(message) {
    //   sendMessageCallbackFunction(message);
    // };
  
    // Topics
</script>

<div>
  <div class="flex flex-col justify-center w-full items-center">
    <h1 class="text-white mb-3 border-b-2 border-dotted border-white w-full text-center text-3xl">Corruption</h1>
    <h2 class="text-white text-xl mb-1.5">Scenario based questions</h2>
    <p class="text-white mb-10">You will be given scenarios and asked questions based on the given scenario.  Not every answer is 100% but you will be marked according to ethics and morals from your answer</p>
    <button class="text-white border-2 p-3">Quiz me</button>
    <Quiz subject="Corruption" />
    <div class="flex flex-col gap-4 w-full">
      
    </div>
  </div>
</div>