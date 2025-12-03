export enum CARD_TYPE {
    MILLER,
    BREWER,
    WITCH,
    GUARD,
    SOLDIER,
    INNKEEP,
    ROYAL,
    HOSPITAL,
}

export interface Card {
    option1: CARD_TYPE,
    option2?: CARD_TYPE,
}
