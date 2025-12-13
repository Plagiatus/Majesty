<script lang="ts">
    import Display from "$lib/cmp/Display.svelte";
    import GameSetup from "$lib/cmp/GameSetup.svelte";
    import Player from "$lib/cmp/Player.svelte";
    import { GAME_EVENT_TYPE } from "$lib/events";
    import { Game } from "$lib/game.svelte";
    import type { LOCATION_SIDE } from "$lib/location";

    let progress: number = 0;

    let player_amount: number = 2;
    let game: Game;

    function startGame(players: string[], sides: LOCATION_SIDE[]) {
        game = new Game(players, sides);

        progress++;
        game.addEventListenerAsync(GAME_EVENT_TYPE.GAME_ENDING, () => {
            progress = 2;
        });
        game.addEventListenerAsync(GAME_EVENT_TYPE.GAME_OVER, () => {
            game.players.sort((a, b) => b.coins - a.coins);
            progress = 3;
        });
    }

    let locked: boolean = false;
    async function selectCard(index: number) {
        if (locked) return;
        locked = true;
        await game.chooseCardFromDisplay(index);
        locked = false;
    }
</script>

{#if progress == 0}
    <GameSetup {startGame}></GameSetup>
{:else if progress == 1}
    <div id="round-nr">
        <div id="round-nr-inner">
            <span>Runde</span> <span>{game.round} / 12</span>
        </div>
    </div>
    <Display
        display={game.display}
        {selectCard}
        meeples={game.current_player.meeples}
    />
    {#each game.players as player, i}
        <div class="player" class:active={i == game.current_player_index}>
            <Player {player} {game} />
        </div>
    {/each}
{:else if progress >= 2}
    {#if progress == 2}
        <p>Berechne Boni...</p>
    {:else if progress >= 3}
        {#each game.players as player, i}
            <p
                class="appear-with-delay"
                style:--delay={(game.players.length - i) * 0.5 + "s"}
            >
                {i + 1}. {player.name}: {player.coins}
            </p>
        {/each}
        <p
            class="appear-with-delay"
            style:--delay={(game.players.length + 1) * 0.5 + "s"}
        >
            Spielende. Neu laden um nochmal zu spielen.
        </p>
    {/if}
{/if}

<style>
    #round-nr {
        position: fixed;
        top: 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        z-index: 100;
    }
    #round-nr-inner {
        background-color: #32553f;
        color: #eae898;
        padding: 10px;
        border-radius: 0 0 10px 10px;
    }

    .player.active {
        scale: 1;
    }
    .player {
        scale: 0.8;
        transition: scale 0.2s linear;
    }

    .appear-with-delay {
        animation: appear 0.5s var(--delay) linear both;
    }

    @keyframes appear {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
</style>
