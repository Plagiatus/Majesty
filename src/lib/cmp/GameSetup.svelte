<script lang="ts">
    import { LOCATION_SIDE, locations } from "$lib/location";
    import Location from "./Location.svelte";

    let { startGame } = $props();

    let players: string[] = $state(Array(4));
    let amountPlayers: number = $derived(
        players.reduce((prev, player) => {
            if (player.trim().length > 0) prev++;
            return prev;
        }, 0),
    );

    let sides: LOCATION_SIDE[] = $state(
        Array(locations.length).fill(LOCATION_SIDE.A),
    );

    function startTheGame(){
        startGame(players.filter((player) => player.length > 0), sides)
    }
</script>

<div id="player-setup">
    <h2>Spieler Setup</h2>
    {#each players as player, i}
        <div>
            <label>
                Spieler {i + 1}:
                <input
                    type="text"
                    bind:value={players[i]}
                    oninput={() => {
                        players[i] = players[i].trim();
                    }}
                    maxlength="24"
                />
            </label>
        </div>
    {/each}
    <p>
        Valide Spieler: {amountPlayers}
    </p>
</div>

<div id="start-game">
    <button onclick={startTheGame} disabled={amountPlayers < 2}>Start</button>
</div>

<div id="card-setup">
    <h2>Karten Setup</h2>
    <p>
        Drehe alle auf Seite
        <button onclick={()=>{sides.fill(LOCATION_SIDE.A)}}>A</button>
        <button onclick={()=>{sides.fill(LOCATION_SIDE.B)}}>B</button>
    </p>
    <div id="card-setup-inner">
        {#each sides as side, i}
            <Location {side} type={i} />
        {/each}
    </div>
</div>

<style>
    #card-setup-inner {
        display: flex;
    }
</style>
