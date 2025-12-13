<script lang="ts">
    import { CARD_TYPE, type Card } from "$lib/types";
    import Unit from "./Unit.svelte";
    import meeple from "$lib/assets/meeple.png";

    let {
        display,
        meeples,
        selectCard = undefined,
    }: {
        display: [Card, number][];
        meeples: number;
        selectCard: ((index: number) => void) | undefined;
    } = $props();
</script>

<div id="display">
    {#each display as slot, i (slot[0])}
        <div class="card-with-meeple" class:deactivated={meeples < i}>
            <Unit
                card={slot[0]}
                onclick={() => {
                    if (selectCard) selectCard(i);
                }}
            >
                {#each Array(slot[1]) as i}
                    <img
                        src={meeple}
                        alt="Meeple"
                        class="meeple"
                        style:--rot={Math.random() * 40 - 20 + "deg"}
                        style:--top={Math.random() * 60 + "px"}
                        style:--left={Math.random() * 30 + "px"}
                    />
                {/each}
            </Unit>
        </div>
    {/each}
    <Unit card={{ option1: CARD_TYPE.BREWER }} dead={true} />
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
        flex-direction: row;
        justify-content: center;
        gap: 10px;
    }

    img.meeple {
        width: 30px;
        position: absolute;
        filter: drop-shadow(3px 0px);
        rotate: var(--rot);
        left: var(--left);
        top: var(--top);
    }
</style>
