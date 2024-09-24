<script lang="ts">
    import { writable } from "svelte/store";
    import arrow from "../assets/arrow.png";

    export let currentComponent: String;
    // let currentComponent = writable<String>("Subject");
</script>

<div class="devinci-topnav flex items-center flex-wrap p-3 text-l font-bold text-white">
    <a href='#/quizCreator'>Subject</a>
    {#if currentComponent}
        {#if currentComponent == "Math"}
            <img src={arrow} class="arrow"/>
            <a href='/#/mychats' class="a2">Math</a>
        {:else if currentComponent == "Corruption"}
            <a href='/#/mychats'>Corruption</a>
        {/if}
    {/if}
    <!-- <a href='/#/about'>About</a> -->
</div>

<style>
    a
    {
        padding-right: 0.5rem;
    }

    .a2
    {
        padding-left: 0.5rem;
    }

    .arrow
    {
        height: 12px;
    }
</style>