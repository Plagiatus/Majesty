import { EventTargetAsync, GAME_EVENT_TYPE } from "./events";
import { Player } from "./player.svelte";
import { CARD_TYPE, type Card } from "./types";
import { shuffleArray } from "./utils";

export const MAX_MEEPLES = 5
const MAX_ROUNDS = 12

export class Game extends EventTargetAsync {
    players: Player[] = $state([]);
    current_player_index: number = $state(-1);

    round: number = $state(0)

    deck: Card[] = $state([])
    display: [Card, number][] = $state([])

    get current_player(): Player {
        return this.players[this.current_player_index]
    }

    constructor(player_amt: number) {
        super();
        for (let i: number = 0; i < player_amt; i++) {
            this.players.push(new Player())
        }
        this.initDeck(player_amt);
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
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.GUARD },
            { option1: CARD_TYPE.GUARD },
            { option1: CARD_TYPE.GUARD },
            { option1: CARD_TYPE.GUARD },
            { option1: CARD_TYPE.GUARD },
            { option1: CARD_TYPE.SOLDIER },
            { option1: CARD_TYPE.SOLDIER },
            { option1: CARD_TYPE.SOLDIER },
            { option1: CARD_TYPE.SOLDIER },
            { option1: CARD_TYPE.SOLDIER },
            { option1: CARD_TYPE.INNKEEP },
            { option1: CARD_TYPE.INNKEEP },
            { option1: CARD_TYPE.INNKEEP },
            { option1: CARD_TYPE.INNKEEP },
            { option1: CARD_TYPE.ROYAL },
            { option1: CARD_TYPE.ROYAL },
        ] // 33
        let batch2: Card[] = [
            { option1: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.MILLER },
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.BREWER },
            { option1: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.WITCH },
            { option1: CARD_TYPE.GUARD },
            { option1: CARD_TYPE.GUARD },
            { option1: CARD_TYPE.GUARD },
            { option1: CARD_TYPE.GUARD },
            { option1: CARD_TYPE.SOLDIER },
            { option1: CARD_TYPE.SOLDIER },
            { option1: CARD_TYPE.SOLDIER },
            { option1: CARD_TYPE.SOLDIER },
            { option1: CARD_TYPE.INNKEEP },
            { option1: CARD_TYPE.INNKEEP },
            { option1: CARD_TYPE.INNKEEP },
            { option1: CARD_TYPE.ROYAL },
            { option1: CARD_TYPE.ROYAL },
            { option1: CARD_TYPE.ROYAL },
        ] // 27

        this.deck.push(...shuffleArray(batch1), ...shuffleArray(batch2))

        this.deck.splice(0, cards_to_remove);

        let start_cards = this.deck.splice(0, 6);
        for (let card of start_cards) {
            this.display.push([card, 0]);
        }
    }

    private next_player() {
        console.log("next player");
        this.current_player_index = (this.current_player_index + 1) % this.players.length;
        if (this.current_player_index == 0) {
            this.round++;
        }

        if (this.round > MAX_ROUNDS) {
            this.endGame();
        }
    }

    private async addCardAndBonus(card: Card, player: Player) {
        player.cards[card.option1].push(card);

        // TODO: Differentiate between side A and B

        switch (card.option1) {
            case CARD_TYPE.MILLER:
                await player.addCoins(2 * player.cards[CARD_TYPE.MILLER].length);
                break;

            case CARD_TYPE.BREWER:
                await player.addCoins(2 * player.cards[CARD_TYPE.BREWER].length);
                await player.addMeeples(1 * player.cards[CARD_TYPE.BREWER].length);

                for (let player of this.players) {
                    await player.addCoins(Math.sign(player.cards[CARD_TYPE.MILLER].length))
                }
                break;

            case CARD_TYPE.WITCH:
                let card = player.cards[CARD_TYPE.HOSPITAL].pop()
                if (card) {
                    // TODO: allow for choosing card again
                    player.cards[card.option1].push(card);
                }
                await player.addCoins(2 * player.cards[CARD_TYPE.MILLER].length +
                    2 * player.cards[CARD_TYPE.BREWER].length +
                    2 * player.cards[CARD_TYPE.WITCH].length);
                break;

            case CARD_TYPE.GUARD:
                await player.addCoins(2 * player.cards[CARD_TYPE.GUARD].length +
                    2 * player.cards[CARD_TYPE.SOLDIER].length +
                    2 * player.cards[CARD_TYPE.INNKEEP].length);
                break;

            case CARD_TYPE.SOLDIER:
                let soldier_amt = player.cards[CARD_TYPE.SOLDIER].length;
                for (let opponent of this.players) {
                    if (player == opponent) continue;
                    if (soldier_amt > opponent.cards[CARD_TYPE.GUARD].length) {
                        for (let i: number = 0; i < CARD_TYPE.HOSPITAL; i++) {
                            if (opponent.cards[i].length > 0) {
                                opponent.cards[CARD_TYPE.HOSPITAL].push(opponent.cards[i].pop()!)
                                break;
                            }
                        }
                    }
                }

                await player.addCoins(3 * soldier_amt);
                break;

            case CARD_TYPE.INNKEEP:
                await player.addCoins(4 * player.cards[CARD_TYPE.INNKEEP].length);

                for (let player of this.players) {
                    await player.addCoins(Math.sign(player.cards[CARD_TYPE.BREWER].length))
                }
                break;

            case CARD_TYPE.ROYAL:
                await player.addCoins(5 * player.cards[CARD_TYPE.ROYAL].length);
                await player.addMeeples(1 * player.cards[CARD_TYPE.ROYAL].length);
        }
    }

    private async endGame() {
        // game is over and it's time to calculate all the bonuses

        // Hospital
        for (let player of this.players) {
            await player.addCoins(-1 * player.cards[CARD_TYPE.HOSPITAL].length)
        }

        // Different people multiplier
        for (let player of this.players) {
            let amountOfDifferentCards = 0;
            for (let i: number = 0; i < CARD_TYPE.HOSPITAL; i++) {
                if (player.cards[i].length > 0) {
                    amountOfDifferentCards++;
                }
            }
            await player.addCoins(amountOfDifferentCards * amountOfDifferentCards);
        }

        // Most people of one type multiplier
        for (let i: number = 0; i < CARD_TYPE.HOSPITAL; i++) {
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
                await player.addCoins(10 + i);
            }
        }
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