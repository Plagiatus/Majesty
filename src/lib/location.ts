import { Player } from "./player.svelte";
import { CARD_TYPE } from "./types";

export enum LOCATION_SIDE {
    A,
    B,
}

export interface Location {
    side: LOCATION_SIDE,
    cardAdded: (player: Player, players: Player[]) => Promise<void>,
    gameEnd?: (players: Player[]) => Promise<void>,
    gameEndMostCardsBonus: () => number,
}

export const locations: Location[] = [
    { // MILLER
        side: LOCATION_SIDE.A,
        async cardAdded(player: Player, players: Player[]) {
            if (this.side == LOCATION_SIDE.A) {
                await player.addCoins(2 * player.cards[CARD_TYPE.MILLER].length);
            } else {
                await player.addCoins(2 * player.cards[CARD_TYPE.MILLER].length);
                for (let player of players) {
                    await player.addCoins(3 * Math.sign(player.cards[CARD_TYPE.WITCH].length))
                }
            }
        },
        gameEndMostCardsBonus(): number {
            if (this.side == LOCATION_SIDE.A) return 10
            return 14
        }
    },
    { // BREWER
        side: LOCATION_SIDE.A,
        async cardAdded(player: Player, players: Player[]) {
            if (this.side == LOCATION_SIDE.A) {
                await player.addCoins(2 * player.cards[CARD_TYPE.BREWER].length);
                await player.addMeeples(1 * player.cards[CARD_TYPE.BREWER].length);

                for (let player of players) {
                    await player.addCoins(2 * Math.sign(player.cards[CARD_TYPE.MILLER].length))
                }
            } else {
                await player.addMeeples(
                    1 * player.cards[CARD_TYPE.BREWER].length +
                    1 * player.cards[CARD_TYPE.MILLER].length
                );
                if (player.cards[CARD_TYPE.INNKEEPER].length > 0 && player.cards[CARD_TYPE.NOBLE].length > 0)
                    await player.addCoins(10)
            }
        },
        gameEndMostCardsBonus(): number {
            if (this.side == LOCATION_SIDE.A) return 11
            return 12
        }
    },
    { // WITCH
        side: LOCATION_SIDE.A,
        async cardAdded(player: Player, players: Player[]) {
            if (this.side == LOCATION_SIDE.A) {
                let card = player.cards[CARD_TYPE.INFIRMARY].pop()
                if (card) {
                    // TODO: allow for choosing card again
                    player.cards[card.option1].push(card);
                }
                await player.addCoins(2 * player.cards[CARD_TYPE.MILLER].length +
                    2 * player.cards[CARD_TYPE.BREWER].length +
                    2 * player.cards[CARD_TYPE.WITCH].length);
            } else {
                let card = player.cards[CARD_TYPE.INFIRMARY].pop()
                if (card) {
                    // TODO: allow for choosing card again
                    player.cards[card.option1].push(card);
                }
                await player.addCoins(3 * player.cards[CARD_TYPE.WITCH].length);
            }
        },
        gameEndMostCardsBonus(): number {
            if (this.side == LOCATION_SIDE.A) return 12
            return 12
        }
    },
    { // GUARD
        side: LOCATION_SIDE.A,
        async cardAdded(player: Player, players: Player[]) {
            if (this.side == LOCATION_SIDE.A) {
                await player.addCoins(2 * player.cards[CARD_TYPE.GUARD].length +
                    2 * player.cards[CARD_TYPE.KNIGHT].length +
                    2 * player.cards[CARD_TYPE.INNKEEPER].length);
            } else {
                await player.addCoins(2 * player.cards[CARD_TYPE.BREWER].length +
                    2 * player.cards[CARD_TYPE.WITCH].length +
                    2 * player.cards[CARD_TYPE.GUARD].length);

                for (let player of players) {
                    await player.addCoins(3 * Math.sign(player.cards[CARD_TYPE.INNKEEPER].length))
                }
            }
        },
        gameEndMostCardsBonus(): number {
            if (this.side == LOCATION_SIDE.A) return 13
            return 8
        }
    },
    { // KNIGHT
        side: LOCATION_SIDE.A,
        async cardAdded(player: Player, players: Player[]) {
            if (this.side == LOCATION_SIDE.A) {
                let soldier_amt = player.cards[CARD_TYPE.KNIGHT].length;
                for (let opponent of players) {
                    if (player == opponent) continue;
                    if (soldier_amt > opponent.cards[CARD_TYPE.GUARD].length) {
                        for (let i: number = 0; i < CARD_TYPE.INFIRMARY; i++) {
                            if (opponent.cards[i].length > 0) {
                                opponent.cards[CARD_TYPE.INFIRMARY].push(opponent.cards[i].pop()!)
                                break;
                            }
                        }
                    }
                }

                await player.addCoins(3 * soldier_amt);
            } else {
                let soldier_amt = player.cards[CARD_TYPE.KNIGHT].length;
                for (let opponent of players) {
                    if (player == opponent) continue;
                    if (soldier_amt > opponent.cards[CARD_TYPE.GUARD].length) {
                        for (let i: number = 0; i < CARD_TYPE.INFIRMARY; i++) {
                            if (opponent.cards[i].length > 0) {
                                opponent.cards[CARD_TYPE.INFIRMARY].push(opponent.cards[i].pop()!)
                                break;
                            }
                        }
                    }
                }

                await player.addCoins(3 * soldier_amt +
                    3 * player.cards[CARD_TYPE.INNKEEPER].length +
                    3 * player.cards[CARD_TYPE.NOBLE].length
                );
            }
        },
        gameEndMostCardsBonus(): number {
            if (this.side == LOCATION_SIDE.A) return 14
            return 8
        }
    },
    { // INNKEEPER
        side: LOCATION_SIDE.A,
        async cardAdded(player: Player, players: Player[]) {
            if (this.side == LOCATION_SIDE.A) {
                await player.addCoins(4 * player.cards[CARD_TYPE.INNKEEPER].length);

                for (let player of players) {
                    await player.addCoins(3 * Math.sign(player.cards[CARD_TYPE.BREWER].length))
                }
            } else {
                let highest: number = 0;
                for (let i: number = 0; i < CARD_TYPE.INFIRMARY - 1; i++) {
                    if (player.cards[i].length > highest)
                        highest = player.cards[i].length
                }

                await player.addCoins(2 * player.cards[CARD_TYPE.INNKEEPER].length * highest);

            }
        },
        gameEndMostCardsBonus(): number {
            if (this.side == LOCATION_SIDE.A) return 15
            return 12
        }
    },
    { // NOBLE
        side: LOCATION_SIDE.A,
        async cardAdded(player: Player, players: Player[]) {
            if (this.side == LOCATION_SIDE.A) {
                await player.addCoins(5 * player.cards[CARD_TYPE.NOBLE].length);
                await player.addMeeples(1 * player.cards[CARD_TYPE.NOBLE].length);
            } else {
                // TODO: Allow trading of money/meeples
                await player.addCoins(4 * player.cards[CARD_TYPE.NOBLE].length +
                    4 * player.cards[CARD_TYPE.INFIRMARY].length
                );
            }
        },
        gameEndMostCardsBonus(): number {
            if (this.side == LOCATION_SIDE.A) return 16
            return 16
        }
    },
    { // INFIRMARY
        side: LOCATION_SIDE.A,
        async cardAdded(player: Player, players: Player[]) {
            console.log("Added card to infirmary.")
        },
        gameEndMostCardsBonus(): number {
            if (this.side == LOCATION_SIDE.A) return 0
            return -10
        },
        async gameEnd(players: Player[]) {
            let penalty: number = this.side == LOCATION_SIDE.A ? 1 : 2;
            for (let player of players) {
                await player.addCoins(-penalty * player.cards[CARD_TYPE.INFIRMARY].length);
            }
        }
    },
]