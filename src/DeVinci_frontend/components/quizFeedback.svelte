<script lang="ts">
    import { onMount } from 'svelte';
    import { storeQuizlocally, getCorruptionQuizzes, getMathQuizzes } from '../helpers/storage';
    import type { Quiz } from "../quiz"

    // let subject = "";
    let quizzes: { [key: string]: Quiz } = {};
    let subject = "";
    let view = "";

    function getQuizzes(selectedSubject: string)
    {
        subject = selectedSubject;

        switch (subject)
        {
            case "Corruption":
                quizzes = getCorruptionQuizzes();
            break;
            case "Math":
                quizzes = getMathQuizzes();
            break;
        }
    }

    function changeTab(selectedView: string)
    {
        view = selectedView;
    }
</script>

<div>
    <h1 class="text-white mb-3 border-b-2 border-dotted border-white w-full text-center text-3xl">Feedback</h1>

    {#if subject === ""}
        <div class="flex flex-col items-center gap-4">
            <button on:click={() => getQuizzes("Corruption")}>Corruption</button>
            <button on:click={() => getQuizzes("Math")}>Math</button>
        </div>
    {:else}
        {#if view === ""}
            <div class="flex flex-col items-center gap-4">
                <button on:click={() => changeTab("Quizzes")}>Quizzes</button>
                <button on:click={() => changeTab("Graph")}>Graph</button>
            </div>
        {:else if view == "Quizzes"}
            {#if Object.keys(quizzes).length > 0}
                {#each Object.entries(quizzes) as [id, quiz]}
                <li>{quiz.scenario}</li>
                {/each}
            {:else}
                <p>No previous Quizzes</p>
            {/if}
        {:else if view == "Graph"}
        {/if}
    {/if}
</div>

<style>
    button
    {
        color: black;
        background-color: white;
        border: 2px dotted black;
        border-radius: 30%;
        padding: 1rem;
        width: 8rem;
        
    }

    p
    {
        background-color: white;
        border-radius: 15%;
        text-align: center;
        padding: 1rem;
    }
</style>