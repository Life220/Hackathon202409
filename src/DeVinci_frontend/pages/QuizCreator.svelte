<script lang="ts">
  import Sidebar from "../components/Sidebar.svelte";
  import Navigation from "../components/Navigation.svelte";
  import Newsletter from "../components/Newsletter.svelte";
  import Footer from "../components/Footer.svelte";
  import devincilogo from "/devinci-logo.svg";

  import { onMount, afterUpdate } from 'svelte';
  import DeVinci from "./deVinci.svelte";
  import StartUpQuizPanel from "../components/StartUpQuizPanel.svelte";
  import Math from "../components/Math.svelte";
  import Corruption from "../components/Corruption.svelte";
  import QuizNav from "../components/quizNav.svelte";
  import arrow from "../assets/arrow.png";
  import { sub } from "@tensorflow/tfjs-core";
  import SelectModel from "../components/SelectModel.svelte";
  import {
    chatModelGlobal,
    activeChatGlobal,
    chatModelIdInitiatedGlobal,
  } from "../store";
  import QuizFeedback from "../components/quizFeedback.svelte";

  let subject: string = "";
  let topic: string | null = null;
  let isChatBoxReady = false;

  function handleSubject(message: string)
  {
    subject = message;
  }
  
  onMount(() => {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const chat = document.getElementById('chat');

    function toggleSidebar(event) {
      event.stopPropagation();
      chat.classList.toggle('-translate-x-full');
    };

    function closeSidebar(event) {
      if (!chat.contains(event.target) && !sidebarToggle.contains(event.target)) {
        chat.classList.add('-translate-x-full');
      };
    };

    function stopPropagation(event) {
      event.stopPropagation();
    };

    sidebarToggle.addEventListener('click', toggleSidebar);
    document.body.addEventListener('click', closeSidebar);
    chat.addEventListener('click', stopPropagation);

    return () => {
      sidebarToggle.removeEventListener('click', toggleSidebar);
      document.body.removeEventListener('click', closeSidebar);
      chat.removeEventListener('click', stopPropagation);
    };
  });

  function back()
  {
    subject = "";
  }

  let currentComponent = "";
  function handleNavClicked(event)
  {
      currentComponent = event.detail.nav;
      console.log("Subject heard :" + currentComponent);
  }

  afterUpdate(() => {
    if ($chatModelIdInitiatedGlobal && !isChatBoxReady) {
      isChatBoxReady = true;
    }
  });
</script>

<div class="flex flex-row h-screen">
  <aside id="chat" class="fixed z-50 bg-gray-200 w-72 min-w-72 h-full md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in">
    <div class="sidebar-content p-4 pt-0 h-full overflow-hidden">
      <Sidebar />
    </div>
  </aside>

  <main class="main flex flex-col flex-grow ml-0 md:ml-72 transition-all duration-150 ease-in">
    <header class="header bg-white shadow py-2 px-4">
      <div class="header-content flex items-center flex-row">
        <!--
        -- triggers sidebar on small devices
        -->
        <button id="sidebarToggle" data-drawer-target="chat" data-drawer-toggle="chat" aria-controls="chat" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
          <span class="sr-only">Open sidebar</span>
          <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
          </svg>
        </button>

        <div class="flex ml-auto">
          <Navigation />
        </div>
      </div>
    </header>


    {#if !$chatModelIdInitiatedGlobal}
      <SelectModel onlyShowDownloadedModels={true} autoInitiateSelectedModel={true}/>
    {:else}
      {#if isChatBoxReady}
        {#key $chatModelIdInitiatedGlobal}
          <main id="QuizMain" class="pt-8 pb-16 lg:pt-8 lg:pb-24 bg-slate-100 dark:bg-gray-900 antialiased">
            <img src={devincilogo} class="rotating-image w-16 h-16 p-0 m-8 rounded-full" alt="devinci logo" />
            <div id="Quiz">
              {#if subject != ""}
                <button class="btnBack" on:click={back}>Subject</button>
                {#if subject === 'Math'}
                  <Math />
                {:else if subject === 'Corruption'}
                  <Corruption />
                {:else if subject === 'Feedback'}
                  <QuizFeedback />
              {/if}
              {:else}
                <!-- <QuizNav on:navClicked={handleNavClicked} /> -->
                <StartUpQuizPanel sendMessageCallbackFunction={handleSubject} />
              {/if}
            </div>
          </main>
        {/key}
      {:else}
        <p>Loading chat interface...</p>
      {/if}
    {/if}

    <Footer />
  </main>
</div>

<style global>
.footer
{
  background: rgba(255,255,255,1);
  padding-top: 10px;
}

#QuizMain
{
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow: auto;
}

#Quiz
{
  width: 90%;
  max-width: 50rem;
}

.back
{
  rotate: 90deg;
  height: 0.7rem;
}

.btnBack
{
  display: block;
  color: beige;
}
</style>  