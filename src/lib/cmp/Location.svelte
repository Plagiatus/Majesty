<script lang="ts">
    import { CARD_TYPE } from "$lib/types";
    import mill_a from "$lib/assets/cards/locations/a/01_mill.jpg";
    import brewery_a from "$lib/assets/cards/locations/a/02_brewery.jpg";
    import witchhut_a from "$lib/assets/cards/locations/a/03_witchhut.jpg";
    import guardtower_a from "$lib/assets/cards/locations/a/04_guardtower.jpg";
    import barracks_a from "$lib/assets/cards/locations/a/05_barracks.jpg";
    import tavern_a from "$lib/assets/cards/locations/a/06_tavern.jpg";
    import castle_a from "$lib/assets/cards/locations/a/07_castle.jpg";
    import infirmary_a from "$lib/assets/cards/locations/a/08_infirmary.jpg";
    import mill_b from "$lib/assets/cards/locations/b/01_mill.jpg";
    import brewery_b from "$lib/assets/cards/locations/b/02_brewery.jpg";
    import witchhut_b from "$lib/assets/cards/locations/b/03_witchhut.jpg";
    import guardtower_b from "$lib/assets/cards/locations/b/04_guardtower.jpg";
    import barracks_b from "$lib/assets/cards/locations/b/05_barracks.jpg";
    import tavern_b from "$lib/assets/cards/locations/b/06_tavern.jpg";
    import castle_b from "$lib/assets/cards/locations/b/07_castle.jpg";
    import infirmary_b from "$lib/assets/cards/locations/b/08_infirmary.jpg";
    import { LOCATION_SIDE } from "$lib/location";
    import type { Snippet } from "svelte";
    import { get } from "svelte/store";

    let {
        type,
        side,
        children,
    }: { type: CARD_TYPE; side: LOCATION_SIDE; children?: Snippet } = $props();

    const imageList: string[] = [
        mill_a,
        brewery_a,
        witchhut_a,
        guardtower_a,
        barracks_a,
        tavern_a,
        castle_a,
        infirmary_a,
        mill_b,
        brewery_b,
        witchhut_b,
        guardtower_b,
        barracks_b,
        tavern_b,
        castle_b,
        infirmary_b,
    ];

    function getImage(): string {
        let index = type + (CARD_TYPE.INFIRMARY + 1) * side;
        return imageList[index];
    }
</script>

<span class="location">
    <img class="location-img" src={getImage()} alt="" />
    {@render children?.()}
</span>

<style>
    .location {
        position: relative;
    }
    .location-img {
        width: 100%;
    }
</style>
