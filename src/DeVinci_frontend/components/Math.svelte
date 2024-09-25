<script lang="ts">  
  import BasicMath from "./basicMath.svelte";
  import QuizNav from "./quizNav.svelte";
  import arrow from "../assets/arrow.png";

  let section: string;
  function setSection(newSection: string)
  {
    section = newSection;
    current = false;
  }

  let current = true;
  function back()
  {
    current = true;
  }
  
  // let currentComponent = "";
  // function handleNavClicked(event)
  // {
  //     currentComponent = event.detail.nav;
  //     console.log("Subject heard on Math: " + currentComponent);
  // }
</script>

<div>
  <img src={arrow} alt="|" class="back">
  <button class="btnBack" on:click={back}>Math</button>
  <!-- {#if currentComponent == "" || currentComponent == "Math"} -->
  {#if !current}
    {#if section == "Basic"}
      <BasicMath />
    {:else if section == "Advanced"}
      <h1>Not yet implemented</h1>
    {/if}
  {:else}
    <!-- <QuizNav currentComponent="Math" on:navClicked={handleNavClicked} /> -->
    <div class="flex flex-col justify-center w-full items-center">
        <h1 class="text-white mb-3 border-b-2 border-dotted border-white w-full text-center text-3xl">Choose a Section</h1>

        <div class="flex flex-col gap-4 w-full">
          <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#f9c490] rounded-lg cursor-pointer"
                  on:click={() => setSection('Basic')}>
              <div class="inline-flex items-center justify-between w-full p-3">
                <p class="w-full text-[#151b1e] text-sm font-normal">Basic</p>
              </div>
            </div>

            <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#a1c490] rounded-lg cursor-pointer"
                  on:click={() => setSection('Advanced')}>
              <div class="inline-flex items-center justify-between w-full p-3">
                <p class="w-full text-[#151b1e] text-sm font-normal">Advanced</p>
              </div>
            </div>
          </div>
      </div>
  {/if}
  <!-- {/if} -->
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
