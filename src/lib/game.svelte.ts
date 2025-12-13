import { EventTargetAsync, GAME_EVENT_TYPE } from "./events";
import { LOCATION_SIDE, locations } from "./location";
import { Player } from "./player.svelte";
import { CARD_TYPE, type Card } from "./types";
import { shuffleArray } from "./utils";

export const MAX_MEEPLES = 5;
const MAX_ROUNDS = 12;

export class Game extends EventTargetAsync {
    players: Player[] = $state([]);
    current_player_index: number = $state(-1);

    round: number = $state(0)

    deck: Card[] = $state([])
    display: [Card, number][] = $state([])

    get current_player(): Player {
        return this.players[this.current_player_index]
    }

    constructor(players: string[], side: LOCATION_SIDE)
    constructor(players: string[], sides: LOCATION_SIDE[])
    constructor(players: string[], sideOrSides: LOCATION_SIDE | LOCATION_SIDE[]) {
        super();
        for (let player of players) {
            this.players.push(new Player(player))
        }
        if (typeof sideOrSides == "number") {
            sideOrSides = Array(CARD_TYPE.INFIRMARY).fill(sideOrSides)
        }
        for (let i: number = 0; i < CARD_TYPE.INFIRMARY; i++) {
            locations[i].side = sideOrSides[i]
        }
        this.initDeck(this.players.length);
        this.next_player()
    }

    private initDeck(player_amt: number): void {
        let cards_to_remove: number = player_amt == 4 ? 7 : player_amt == 3 ? 19 : 27

        let batch1: Card[] = [
            { option1: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.GUARD },
            { option1: CARD_TYPE.GUARD },
            { option1: CARD_TYPE.GUARD },
            { option1: CARD_TYPE.KNIGHT },
            { option1: CARD_TYPE.KNIGHT },
            { option1: CARD_TYPE.INNKEEPER },
            { option1: CARD_TYPE.INNKEEPER },
            { option1: CARD_TYPE.NOBLE },
            { option1: CARD_TYPE.NOBLE },
            { option1: CARD_TYPE.NOBLE },

            { option1: CARD_TYPE.WITCH, option2: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.WITCH, option2: CARD_TYPE.GUARD },
            { option1: CARD_TYPE.BREWER, option2: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.BREWER, option2: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.NOBLE, option2: CARD_TYPE.GUARD },
            { option1: CARD_TYPE.KNIGHT, option2: CARD_TYPE.INNKEEPER },
            { option1: CARD_TYPE.KNIGHT, option2: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.GUARD, option2: CARD_TYPE.INNKEEPER },
            { option1: CARD_TYPE.NOBLE, option2: CARD_TYPE.INNKEEPER },
        ] // 33
        let batch2: Card[] = [
            { option1: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.GUARD },
            { option1: CARD_TYPE.GUARD },
            { option1: CARD_TYPE.KNIGHT },
            { option1: CARD_TYPE.INNKEEPER },
            { option1: CARD_TYPE.INNKEEPER },
            { option1: CARD_TYPE.NOBLE },
            { option1: CARD_TYPE.NOBLE },

            { option1: CARD_TYPE.GUARD, option2: CARD_TYPE.KNIGHT },
            { option1: CARD_TYPE.GUARD, option2: CARD_TYPE.KNIGHT },
            { option1: CARD_TYPE.GUARD, option2: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.GUARD, option2: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.NOBLE, option2: CARD_TYPE.INNKEEPER },
            { option1: CARD_TYPE.BREWER, option2: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.BREWER, option2: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.BREWER, option2: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.KNIGHT, option2: CARD_TYPE.INNKEEPER },
            { option1: CARD_TYPE.KNIGHT, option2: CARD_TYPE.INNKEEPER },
            { option1: CARD_TYPE.NOBLE, option2: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.KNIGHT, option2: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.KNIGHT, option2: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.INNKEEPER, option2: CARD_TYPE.WITCH },
        ] // 27

        this.deck.push(...shuffleArray(batch1), ...shuffleArray(batch2))

        this.deck.splice(0, cards_to_remove);

        let start_cards = this.deck.splice(0, 6);
        for (let card of start_cards) {
            this.display.push([card, 0]);
        }
    }

    private async next_player() {
        this.current_player_index = (this.current_player_index + 1) % this.players.length;
        if (this.current_player_index == 0) {
            this.round++;
        }

        if (this.round > MAX_ROUNDS) {
            await this.dispatchEventAsync({ type: GAME_EVENT_TYPE.GAME_ENDING })
            this.endGame();
        } else {
            await this.dispatchEventAsync({ type: GAME_EVENT_TYPE.NEXT_PLAYER, target: this.current_player })
        }
    }

    private async addCardAndBonus(card: Card, player: Player) {
        player.cards[card.option1].push(card);
        await locations[card.option1].cardAdded(player, this.players);
    }

    private async endGame() {
        // game is over and it's time to calculate all the bonuses

        // Hospital
        locations[CARD_TYPE.INFIRMARY].gameEnd?.(this.players)

        // Different people multiplier
        for (let player of this.players) {
            let amountOfDifferentCards = 0;
            for (let i: number = 0; i < CARD_TYPE.INFIRMARY; i++) {
                if (player.cards[i].length > 0) {
                    amountOfDifferentCards++;
                }
            }
            await player.addCoins(amountOfDifferentCards * amountOfDifferentCards);
        }

        // Most people of one type multiplier
        for (let i: number = 0; i < CARD_TYPE.INFIRMARY; i++) {
            let playersWithMost: Player[] = [];
            let most: number = 1;
            for (let player of this.players) {
                let cardAmount = player.cards[i].length;
                if (cardAmount == most) {
                    playersWithMost.push(player);
                } else if (cardAmount > most) {
                    most = cardAmount;
                    playersWithMost = [player];
                }
            }
            for (let player of playersWithMost) {
                await player.addCoins(locations[i].gameEndMostCardsBonus());
            }
        }
        await this.dispatchEventAsync({ type: GAME_EVENT_TYPE.GAME_OVER })
    }


    public async chooseCardFromDisplay(index: number) {
        // can player afford this card?
        if (index > this.current_player.meeples) {
            this.dispatchEventAsync({ type: GAME_EVENT_TYPE.ERROR_NOT_ENOUGH_MEEPLES })
            throw new Error("Not enough meeples!");
        }

        // add meeples to cards in display
        for (let i: number = 0; i < index; i++) {
            this.display[i][1] += 1;
        }
        await this.current_player.addMeeples(-index);

        // get chosen card
        let [card, meeples] = this.display.splice(index, 1)[0];

        // refill display
        if (this.deck.length > 0)
            this.display.push([this.deck.shift()!, 0]);

        // TODO: select card option if there is more than 1

        // add meeples to players bank
        await this.current_player.addMeeples(meeples);

        // add card to players deck & calc bonus
        await this.addCardAndBonus(card, this.current_player);

        // if too many meeples, give coins instead
        if (this.current_player.meeples > MAX_MEEPLES) {
            let coins = this.current_player.meeples - MAX_MEEPLES;
            await this.current_player.setMeeples(MAX_MEEPLES);
            await this.current_player.addCoins(coins);
        }

        // player turn ended, next players turn
        this.next_player();
    }

}