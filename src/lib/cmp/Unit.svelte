<script lang="ts">
    import { CARD_TYPE, type Card } from "$lib/types";
    import type { MouseEventHandler } from "svelte/elements";

    import miller from "$lib/assets/cards/units/01_miller.jpg";
    import brewer from "$lib/assets/cards/units/02_brewer.jpg";
    import witch from "$lib/assets/cards/units/03_witch.jpg";
    import guard from "$lib/assets/cards/units/04_guard.jpg";
    import knight from "$lib/assets/cards/units/05_knight.jpg";
    import innkeeper from "$lib/assets/cards/units/06_innkeeper.jpg";
    import noble from "$lib/assets/cards/units/07_noble.jpg";
    import defeated from "$lib/assets/cards/units/08_dead.jpg";
    import type { Snippet } from "svelte";

    const imageList: string[] = [
        miller,
        brewer,
        witch,
        guard,
        knight,
        innkeeper,
        noble,
    ];

    let {
        card,
        dead,
        onclick,
        children,
    }: {
        card: Card;
        dead?: boolean;
        onclick?: MouseEventHandler<any> | undefined;
        children?: Snippet;
    } = $props();
</script>

{#if !dead}
    <button type="button" class="unit" {onclick} class:split={card.option2} class:clickable={onclick}>
        <img src={imageList[card.option1]} alt={CARD_TYPE[card.option1]} />
        {#if card.option2}
            <img
                class="lower-half"
                src={imageList[card.option2]}
                alt={CARD_TYPE[card.option2]}
            />
        {/if}
        {@render children?.()}
    </button>
{:else}
    <button type="button" class="unit" {onclick}>
        <img src={defeated} alt="Defeated" />
    </button>
{/if}

<style>
    .unit {
        position: relative;
        width: 67px;
        height: 103px;
    }

    .clickable {
        cursor: pointer;
    }

    img {
        inset: 0;
        width: 100%;
        height: 100%;
        position: absolute;
    }
    .split img {
        clip-path: polygon(0 0, 100% 0, 100% 38%, 0 58%);
    }
    .split img.lower-half {
        rotate: 180deg;
    }
</style>
