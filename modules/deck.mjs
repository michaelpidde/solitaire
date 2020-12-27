export const draw = (deck, drawnCards) => {
    drawnCards.push(deck.slice(0, 1)[0]);
    deck.splice(0, 1);
    return [deck, drawnCards];
}

export const deal = (deck, stacks) => {
    for(let i = 0; i < 7; ++i) {
        stacks[i] = deck.slice(0, i + 1);
        deck.splice(0, i + 1);
    }
    return [deck, stacks];
}

export const create = (deck, suits) => {
    for(let key in suits) {
        for(let i = 1; i <= 13; ++i) {
            deck.push({
                face: false,
                suit: key,
                number: i,
                position: {
                    x: 0,
                    y: 0
                },
            });
        }
    };
}

export const cardId = (card) => card.suit + '_' + card.number;
export const cardClass = (card) => card.face ? 'card facecard ' + card.suit : 'card cardback';