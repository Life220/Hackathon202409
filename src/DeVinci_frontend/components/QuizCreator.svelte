<script lang="ts">
    import Sidebar from "./Sidebar.svelte";
    import Navigation from "./Navigation.svelte";
    import Newsletter from "./Newsletter.svelte";
    import Footer from "./Footer.svelte";
    import devincilogo from "/devinci-logo.svg";
  
    import { onMount } from 'svelte';
    import DeVinci from "../pages/deVinci.svelte";
    import StartUpQuizPanel from "./StartUpQuizPanel.svelte";
    import Math from "./Math.svelte";
    import Corruption from "./Corruption.svelte";
    import QuizNav from "./quizNav.svelte";
    import arrow from "../assets/arrow.png";
    import { sub } from "@tensorflow/tfjs-core";
  
    let subject: string = "";
    let topic: string | null = null;

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
</script>
  
<div>
    <main id="QuizMain" class="pt-8 pb-16 lg:pt-8 lg:pb-24 bg-slate-100 dark:bg-gray-900 antialiased">
      <img src={devincilogo} class="rotating-image w-16 h-16 p-0 m-8 rounded-full" alt="devinci logo" />
      <div id="Quiz">
        {#if subject != ""}
          <button class="btnBack" on:click={back}>Subject</button>
          {#if subject === 'Math'}
            <Math />
          {:else if subject === 'Corruption'}
          <Corruption />
        {/if}
        {:else}
          <!-- <QuizNav on:navClicked={handleNavClicked} /> -->
          <StartUpQuizPanel sendMessageCallbackFunction={handleSubject} />
        {/if}
      </div>
    </main>

    <Footer />
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