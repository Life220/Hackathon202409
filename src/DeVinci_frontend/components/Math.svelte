<script lang="ts">  
    export let sendMessageCallbackFunction;
  
    function sendMessage(message) {
      sendMessageCallbackFunction(message);
    };
  
    // Topics
    const Addition = 'Addition (+)';
    const Subtraction = 'Subtraction (/)';
    const Multiplication = 'Multiplication (x)';
    const Division = 'Division (÷)';
    const Square = 'Square (x²)';
    const Cube = 'Cube (x³)';
    const Power = 'Power (xⁿ)';
  </script>
  
  <div>
    <div class="flex flex-col justify-center w-full items-center">
      <h1 class="text-white mb-3 border-b-2 border-dotted border-white w-full text-center text-3xl">Select a Topic</h1>

      <div class="flex flex-col gap-4 w-full">
        <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#f9c490] rounded-lg cursor-pointer"
             on:click={() => sendMessage('Addition')}>
          <div class="inline-flex items-center justify-between w-full p-3">
            <p class="w-full text-[#151b1e] text-sm font-normal">{Addition}</p>
          </div>
        </div>

        <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#a1c490] rounded-lg cursor-pointer"
             on:click={() => sendMessage('Subtraction')}>
          <div class="inline-flex items-center justify-between w-full p-3">
            <p class="w-full text-[#151b1e] text-sm font-normal">{Subtraction}</p>
          </div>
        </div>

        <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#a1c490] rounded-lg cursor-pointer"
             on:click={() => sendMessage('Multiplication')}>
          <div class="inline-flex items-center justify-between w-full p-3">
            <p class="w-full text-[#151b1e] text-sm font-normal">{Multiplication}</p>
          </div>
        </div>

        <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#f0e68c] rounded-lg cursor-pointer"
             on:click={() => sendMessage('Division')}>
          <div class="inline-flex items-center justify-between w-full p-3">
            <p class="w-full text-[#151b1e] text-sm font-normal">{Division}</p>
          </div>
        </div>

        <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#cb8bd0] rounded-lg cursor-pointer disabled"
             on:click={() => sendMessage('Square')}>
          <div class="inline-flex items-center justify-between w-full p-3">
            <p class="w-full text-[#151b1e] text-sm font-normal">{Square}</p>
          </div>
        </div>

        <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#cb8bd0] rounded-lg cursor-pointer disabled"
             on:click={() => sendMessage('Cube')}>
          <div class="inline-flex items-center justify-between w-full p-3">
            <p class="w-full text-[#151b1e] text-sm font-normal">{Cube}</p>
          </div>
        </div>

        <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#cb8bd0] rounded-lg cursor-pointer disabled"
             on:click={() => sendMessage('Power')}>
          <div class="inline-flex items-center justify-between w-full p-3">
            <p class="w-full text-[#151b1e] text-sm font-normal">{Power}</p>
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

    h2
    {
        color: white;
    }
  </style>
  