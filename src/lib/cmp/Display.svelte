<script lang="ts">
    import type { Card } from "$lib/types";
    import CardComp from "./Card.svelte";

    let {display, meeples, selectCard = undefined}: 
        {display: [Card, number][], meeples: number, selectCard: ((index: number) => void) | undefined} = $props();
</script>

<div id="display">
    {#each display as slot, i}
        <div class="card-with-meeple" class:deactivated={meeples < i}>
            <CardComp
                card={slot[0]}
                onclick={() => {
                    if (selectCard) selectCard(i);
                }}
            />
            <span>{slot[1]} Meeples</span>
        </div>
    {/each}
</div>

<style>
    .card-with-meeple {
        display: flex;
    }

    .card-with-meeple.deactivated {
        opacity: 0.5;
        pointer-events: none;
    }

    #display {
        display: flex;
        flex-direction: column-reverse;
    }
</style>
