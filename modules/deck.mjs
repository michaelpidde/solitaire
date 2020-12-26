export const remove = (deck, destination, start, number) => {
    destination = deck.slice(start, number);
    deck.splice(start, number);
    return [deck, destination];
}

export const deal = (deck, stacks) => {
    for(let i = 0; i < 7; ++i) {
        [deck, stacks[i]] = remove(deck, stacks[i], 0, i + 1);
    }
    return [deck, stacks];
}

export const create = (deck, suits) => {
    suits.map((suit) => {
        for(let i = 1; i <= 13; ++i) {
            deck.push({
                face: false,
                suit: suit,
                number: i,
                position: {
                    x: 0,
                    y: 0
                },
            });
        }
    });
}