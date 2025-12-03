import { EventTargetAsync, GAME_EVENT_TYPE } from "./events"
import { MAX_MEEPLES } from "./game.svelte"
import type { Card } from "./types";

export class Player extends EventTargetAsync {
    #meeples: number = $state(MAX_MEEPLES);
    #coins: number = $state(0);
    #cards: Card[][] = $state([[],[],[],[],[],[],[],[]]);

    get meeples(): number {
        return this.#meeples;
    }
    async setMeeples(amt: number) {
        let diff = amt - this.#meeples;
        this.#meeples = amt;
        await this.dispatchEventAsync({ type: GAME_EVENT_TYPE.PLAYER_CHANGED_MEEPLES, target: this, detail: diff })
    }
    async addMeeples(amt: number) {
        this.#meeples += amt;
        if(amt !== 0) await this.dispatchEventAsync({ type: GAME_EVENT_TYPE.PLAYER_CHANGED_MEEPLES, target: this, detail: amt })
    }

    get coins(): number {
        return this.#coins;
    }
    async setCoins(amt: number) {
        let diff = amt - this.#coins;
        this.#coins = amt;
        await this.dispatchEventAsync({ type: GAME_EVENT_TYPE.PLAYER_CHANGED_MONEY, target: this, detail: diff });
    }
    async addCoins(amt: number) {
        this.#coins += amt;
        if(amt !== 0) await this.dispatchEventAsync({ type: GAME_EVENT_TYPE.PLAYER_CHANGED_MONEY, target: this, detail: amt });
    }

    get cards(): Card[][] {
        return this.#cards;
    }
}