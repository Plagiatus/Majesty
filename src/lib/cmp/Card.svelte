<script lang="ts">
    import { CARD_TYPE, type Card } from "$lib/types";
    import type { MouseEventHandler } from "svelte/elements";

    export let card: Card;
    export let onclick: MouseEventHandler<any> | undefined = undefined
</script>

<button type="button" class="card" on:click={onclick}>
    {CARD_TYPE[card.option1]}
</button>
