<script lang="ts">
    import { writable } from "svelte/store";
    import arrow from "../assets/arrow.png";
    import { createEventDispatcher, onMount } from "svelte";

    let components = writable<String[]>([]);
    export let currentComponent: String;

    const dispatch = createEventDispatcher();
    export function clickedNav()
    {
        const nav = "Subject"; // Set the nav value
        console.log("clicked:" + nav);
        dispatch("navClicked", { nav });
    }
    // let currentComponent = writable<String>("Subject");
        onMount(() => {
        // Initialize the components array with the current component
        components.update(current => {
            if (!current.includes(currentComponent)) {
                return [...current, currentComponent];
            }
            return current;
        });
        // Log the initial components array
        console.log("Initial components array:", $components);
    });
</script>

<div class="devinci-topnav flex items-center flex-wrap p-3 text-l font-bold text-white">
    <button on:click={clickedNav}>Subject</button>
    {#if currentComponent}
        {#if $components.includes("Math")}
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