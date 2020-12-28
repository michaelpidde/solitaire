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
}

export const initializeCards = (cards, suits) => {
    for(let key in suits) {
        for(let i = 1; i <= 13; ++i) {
            cards[key + '_' + i] = {
                face: false,
                suit: key,
                number: i,
                visible: false,
                position: {
                    x: 0,
                    y: 0
                },
            };
        }
    };
}

export const addCards = (deck, cards) => {
    for(let card in cards) {
        deck.push(cardId(cards[card]));
    };
}

export const transformNumber = (number) => {
    if(number == 1) { return 'A' }
    if(number == 11) { return 'J' }
    if(number == 12) { return 'Q' }
    if(number == 13) { return 'K' }
    return number;
}

export const cardId = (card) => card.suit + '_' + card.number;
export const cardFromId = (id) => {
    return {
        suit: id.split('_')[0],
        number: id.split('_')[1]
    };
}
export const cardClass = (card) => card.face ? 'card facecard ' + card.suit : 'card cardback';