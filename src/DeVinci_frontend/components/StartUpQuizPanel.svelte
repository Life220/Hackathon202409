  <script lang="ts">
    export let sendMessageCallbackFunction;
  
    function sendMessage(message) {
      sendMessageCallbackFunction(message);
    };
  
    // Sample prompts
    const Corruption = 'Corruption';
    const Math = 'Math';
    const English = 'English';
    const Physics = 'Physics';
    const Accounting = 'Accounting';
    const Information_Technology = 'Information Techbology';
    const Feedback = 'Feedback';
  </script>
  
  <div>
    <div class="flex flex-col justify-center w-full items-center">
      <h1 class="text-white mb-3 border-b-2 border-dotted border-white w-full text-center text-3xl">Select a Subject</h1>

      <div class="flex flex-col gap-4 w-full">
        <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#f9c490] rounded-lg cursor-pointer"
             on:click={() => sendMessage(Corruption)}>
          <div class="inline-flex items-center justify-between w-full p-3">
            <p class="w-full text-[#151b1e] text-sm font-normal">{Corruption}</p>
          </div>
        </div>

        <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#f9c490] rounded-lg cursor-pointer"
             on:click={() => sendMessage(Math)}>
          <div class="inline-flex items-center justify-between w-full p-3">
            <p class="w-full text-[#151b1e] text-sm font-normal">{Math}</p>
          </div>
        </div>

        <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#a1c490] rounded-lg cursor-pointer disabled"
             on:click={() => sendMessage(English)}>
          <div class="inline-flex items-center justify-between w-full p-3">
            <p class="w-full text-[#151b1e] text-sm font-normal">{English}</p>
          </div>
        </div>

        <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#a1c490] rounded-lg cursor-pointer disabled"
             on:click={() => sendMessage(Information_Technology)}>
          <div class="inline-flex items-center justify-between w-full p-3">
            <p class="w-full text-[#151b1e] text-sm font-normal">{Information_Technology}</p>
          </div>
        </div>

        <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#f0e68c] rounded-lg cursor-pointer disabled"
             on:click={() => sendMessage(Physics)}>
          <div class="inline-flex items-center justify-between w-full p-3">
            <p class="w-full text-[#151b1e] text-sm font-normal">{Physics}</p>
          </div>
        </div>

        <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#cb8bd0] rounded-lg cursor-pointer disabled"
             on:click={() => sendMessage(Accounting)}>
          <div class="inline-flex items-center justify-between w-full p-3">
            <p class="w-full text-[#151b1e] text-sm font-normal">{Accounting}</p>
          </div>
        </div>

        <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#cb8bd0] rounded-lg cursor-pointer w-24 text-center self-center"
             on:click={() => sendMessage(Feedback)}>
          <div class="inline-flex items-center justify-between w-full p-3">
            <p class="w-full text-[#151b1e] text-sm font-normal">{Feedback}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <style>
    .cursor-pointer {
      cursor: pointer;
    }

    .disabled
    {
      background-color: #a1a1a1;
      pointer-events: none;
    }
  </style>
  