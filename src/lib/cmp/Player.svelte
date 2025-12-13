<script lang="ts">
    import { GAME_EVENT_TYPE, type GameEvent } from "$lib/events";
    import type { Player } from "$lib/player.svelte";
    import type { Game } from "$lib/game.svelte";
    import { locations } from "$lib/location";
    import Location from "./Location.svelte";
    import Unit from "./Unit.svelte";
    import { CARD_TYPE } from "$lib/types";

    let { player, game }: { player: Player; game: Game } = $props();

    $effect(() => {
        player.addEventListenerAsync(
            GAME_EVENT_TYPE.PLAYER_CHANGED_MONEY,
            money_animation,
        );
        player.addEventListenerAsync(
            GAME_EVENT_TYPE.PLAYER_CHANGED_MEEPLES,
            meeple_animation,
        );

        game.addEventListenerAsync(GAME_EVENT_TYPE.GAME_ENDING, () => {
            player.removeEventListenerAsync(
                GAME_EVENT_TYPE.PLAYER_CHANGED_MONEY,
                money_animation,
            );
            player.removeEventListenerAsync(
                GAME_EVENT_TYPE.PLAYER_CHANGED_MEEPLES,
                meeple_animation,
            );
        });
    });

    let coinElement: HTMLSpanElement;
    let meepleElement: HTMLSpanElement;
    async function money_animation(ev: GameEvent) {
        if (ev.detail == 0) return;
        await createPopup(ev.detail, coinElement);
    }
    async function meeple_animation(ev: GameEvent) {
        if (ev.detail == 0) return;
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

<h2>{player.name}</h2>
<div class="scores">
    <span bind:this={meepleElement}>Meeples: {player.meeples}</span>
    <span bind:this={coinElement}>Coins: {player.coins}</span>
</div>
<div class="cards">
    {#each locations as location, i}
        <Location side={locations[i].side} type={i}>
            <div class="units-at-location">
                {#each player.cards[i] as card}
                    <span>
                        <Unit {card} dead={i == CARD_TYPE.INFIRMARY} />
                    </span>
                {/each}
            </div>
            <!-- <span class="amount">{player.cards[i].length}</span> -->
        </Location>
    {/each}
</div>

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

    .cards {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        width: 100%;
        position: relative;
    }
    .units-at-location {
        position: absolute;
        inset: 0;
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(auto-fit, 30px);
        align-items: center;
        padding: 25% 5% 60% 5%;
    }
    .units-at-location > * {
        margin-left: -15px;
    }
</style>
