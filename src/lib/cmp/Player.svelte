<script lang="ts">
    import { GAME_EVENT_TYPE, type GameEvent } from "$lib/events";
    import type { Player } from "$lib/player.svelte";
    import { CARD_TYPE } from "$lib/types";

    let { player }: { player: Player } = $props();

    $effect(() => {
        player.addEventListenerAsync(
            GAME_EVENT_TYPE.PLAYER_CHANGED_MONEY,
            money_animation,
        );
        player.addEventListenerAsync(
            GAME_EVENT_TYPE.PLAYER_CHANGED_MEEPLES,
            meeple_animation,
        );
    });

    let coinElement: HTMLSpanElement;
    let meepleElement: HTMLSpanElement;
    async function money_animation(ev: GameEvent) {
        if(ev.detail == 0) return;
        await createPopup(ev.detail, coinElement);
    }
    async function meeple_animation(ev: GameEvent) {
        if(ev.detail == 0) return;
        await createPopup(ev.detail, meepleElement);
    }

    async function createPopup(amount: number, parent: HTMLElement) {
        return new Promise((resolve) => {
            let el = document.createElement("span");
            el.innerText = (amount > 0 ? "+" : "") + amount;
            parent.appendChild(el);
            el.classList.add("addPopup");
            el.addEventListener("animationend", () => {
                resolve(undefined);
                el.remove();
            });
        });
    }
</script>

<p>
    <span bind:this={meepleElement}>Meeples: {player.meeples}</span><br />
    <span bind:this={coinElement}>Coins: {player.coins}</span><br />
    <span>Müllerin: {player.cards[CARD_TYPE.MILLER].length}</span>
    <span>Brauer: {player.cards[CARD_TYPE.BREWER].length}</span>
    <span>Hexe: {player.cards[CARD_TYPE.WITCH].length}</span>
    <span>Wachen: {player.cards[CARD_TYPE.GUARD].length}</span>
    <span>Soldat: {player.cards[CARD_TYPE.SOLDIER].length}</span>
    <span>Wirt: {player.cards[CARD_TYPE.INNKEEP].length}</span>
    <span>Adlige: {player.cards[CARD_TYPE.ROYAL].length}</span>
    <span>Lazarett: {player.cards[CARD_TYPE.HOSPITAL].length}</span>
</p>

<style>
    span {
        position: relative;
    }
    :global(.addPopup) {
        position: absolute;
        animation: popup 0.5s linear;
    }

    @keyframes popup {
        0% {
            scale: 1;
        }
        100% {
            scale: 2;
        }
    }
</style>
