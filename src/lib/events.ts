import type { Player } from "./player.svelte";

export enum GAME_EVENT_TYPE {
    PLAYER_CHANGED_MONEY = "playerChangedMoney",
    PLAYER_CHANGED_MEEPLES = "playerChangedMeeples",

    REMOVE_CARD_FROM_DISPLAY = "removeCardFromDisplay",
    
    NEXT_ROUND = "nextRound",
    NEXT_PLAYER = "nextPlayer",
    GAME_ENDING = "gameEnding",
    GAME_OVER = "gameOver",
    
    ERROR_NOT_ENOUGH_MEEPLES = "errorNotEnoughMeeples",
}

export interface GameEvent<T = any> {
    type: GAME_EVENT_TYPE,
    target?: Player,
    detail?: T,
}

export type EventListenerAsync = (ev: GameEvent) => Promise<any> | void;

export class EventTargetAsync extends EventTarget {
    private listeners = new Map<GAME_EVENT_TYPE, EventListenerAsync[]>()

    addEventListenerAsync(event: GAME_EVENT_TYPE, listener: EventListenerAsync) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(listener);
    }
    removeEventListenerAsync(event: GAME_EVENT_TYPE, listener: EventListenerAsync) {
        let listeners = this.listeners.get(event);
        if (!listeners) return;
        let index = listeners.findIndex((v) => v === listener);
        if (index < 0) return;
        listeners.splice(index, 1);
    }
    async dispatchEventAsync<T>(event: GameEvent<T>) {
        if (!this.listeners.has(event.type)) return;
        const listeners = [...this.listeners.get(event.type)!]; // copying this so removing listeners doesn't skip any
        for (let listener of listeners) {
            try {
                await listener(event);
            } catch (error) {
                console.error(error);
            }
        }
    }
}