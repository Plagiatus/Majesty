export enum CARD_TYPE {
    MILLER,
    BREWER,
    WITCH,
    GUARD,
    KNIGHT,
    INNKEEPER,
    NOBLE,
    INFIRMARY,
}

export interface Card {
    option1: CARD_TYPE,
    option2?: CARD_TYPE,
}
