<script lang="ts">
    import Display from "$lib/cmp/Display.svelte";
    import Player from "$lib/cmp/Player.svelte";
    import { Game } from "$lib/game.svelte";

    let progress: number = 0;

    let player_amount: number = 2;
    let game: Game;

    function startGame() {
        game = new Game(player_amount);

        progress++;
    }

    function selectCard(index: number){
        game.chooseCardFromDisplay(index);
    }
</script>

{#if progress == 0}
    <label for="amountPlayers">Spielerzahl</label>
    <input
        type="number"
        name="amountPlayers"
        id="amountPlayers"
        min="2"
        max="4"
        bind:value={player_amount}
    />
    <button onclick={startGame}>Start</button>
{:else if progress == 1}
    <Display display={game.display} {selectCard} meeples={game.current_player.meeples}/>
    {#each game.players as player, i}
        <div class="player" class:active={i == game.current_player_index}>
            <Player {player} />
        </div>
    {/each}
{:else}
    <h1>Spielende. Neu laden um nochmal zu spielen.</h1>
{/if}

<style>
    .player.active {
        font-weight: bold;
    }
</style>