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
  