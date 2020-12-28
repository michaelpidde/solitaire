import { shuffle, scalarFindParentArray } from './modules/arrays.mjs'
import * as Deck from './modules/deck.mjs';
import * as DOM from './modules/dom.mjs';
import runTests from './modules/tests.mjs';

const drawCard = () => {
    incrementMoves();
    if(state.visibleDrawnCards < 3) {
        ++state.visibleDrawnCards;
    }
    [state.deck, state.drawnCards] = Deck.draw(state.deck, state.drawnCards);
    DOM.updateDrawnCards(state.cards, state.drawnCards, state.visibleDrawnCards, elements, clickCard);

    if(state.deck.length == 0) {
        const deckElement = document.getElementById(elements.deck);
        deckElement.className = 'reset';
        deckElement.onclick = resetDeck;
    }
}

const resetDeck = () => {
    let card = null;
    let cardElement = null;
    state.visibleDrawnCards = 0;
    for(let i = 0; i <= 2; ++i) {
        card = state.drawnCards[state.drawnCards.length - (1 + i)];
        cardElement = document.getElementById(card);
        cardElement.style.display = 'none';
    }

    state.deck = state.drawnCards;
    state.drawnCards = [];
    const deckElement = document.getElementById(elements.deck);
    deckElement.className = 'cardback';
    deckElement.onclick = drawCard;
}

// TODO: This Godmode function can probably be split up into events per card location, or event type
// (i.e. promotion to pile vs. moving between stacks vs. moving from drawn cards to a stack)
const clickCard = (event) => {
    const cardElement = (event.target.offsetParent.id == elements.board) ? event.target : event.target.offsetParent;
    let {suit, number} = Deck.cardFromId(cardElement.id);
    const pile = state.piles[suit];
    const card = state.cards[cardElement.id];
    
    const inDraw = state.drawnCards.indexOf(cardElement.id) > -1;
    const inStack = (inDraw) ? -1 : scalarFindParentArray(state.stacks, cardElement.id);
    // TODO: Do we need this variable?
    const inPile = (inDraw || inStack > -1) ? false : true;
    
    // Move card to pile if possible
    if(pile.length == number - 1) {
        const pileElement = document.getElementById(elements.pile[suit]);
        card.position.x = pileElement.offsetLeft;
        card.position.y = pileElement.offsetTop;
        cardElement.style.left = card.position.x + 'px';
        cardElement.style.top = card.position.y + 'px';

        pile.push(cardElement.id);
        DOM.zIndexCollection(pile);

        if(inDraw) {
            const drawPosition = state.drawnCards.indexOf(cardElement.id);
            state.drawnCards.splice(drawPosition);
            // Attach click event to prior drawn card (if there was one) so it can be played
            if(drawPosition > 0) {
                document.getElementById(state.drawnCards[drawPosition - 1]).onclick = clickCard;
            }
            // Re-render drawn cards
            --state.visibleDrawnCards;
            DOM.updateDrawnCards(state.cards, state.drawnCards, state.visibleDrawnCards, elements, clickCard);
        }
        if(inStack > -1 && inStack == state.stacks[inStack].length - 1) {
            state.stacks[inStack].splice(state.stacks[inStack].indexOf(cardElement.id));
            // Flip next card in stack
            if(state.stacks[inStack].length > 0) {
                const nextCardId = state.stacks[inStack][state.stacks[inStack].length - 1];
                const nextCard = state.cards[nextCardId];
                const nextCardElement = document.getElementById(nextCardId);
                nextCard.face = true;
                nextCardElement.className = Deck.cardClass(card);
                nextCardElement.onclick = clickCard;
            }
        }
    }

    // Else move card to leftmost valid stack, re-zindex
    // If moved:
    // - increase moves
    // - flip next card in stack if there are more 
}

const incrementMoves = () => {
    ++state.totalMoves;
    DOM.updateMoves(elements.moves, state.totalMoves);
}

const renderStacks = () => {
    let stack = [];
    let increment = 0;
    let card = {};
    let cardElement = null;
    let lastCard = false;
    const leftOffset = 15;
    for(let i = 0; i < state.stacks.length; ++i) {
        lastCard = false;
        increment = (110 + 15) * i; // card width + right margin
        stack = state.stacks[i];
        for(let j = 0; j < stack.length; ++j) {
            if(j == stack.length - 1) {
                lastCard = true;
            }
            card = state.cards[stack[j]];
            card.position.x = increment + leftOffset;
            card.position.y += j * 30;
            if(lastCard) {
                card.face = true;
            }
            cardElement = document.getElementById(stack[j]);
            cardElement.className = Deck.cardClass(card);
            cardElement.style.top = card.position.y + 200 + 'px';
            cardElement.style.left = card.position.x + 'px';
            cardElement.style.display = 'block';
            if(lastCard) {
                cardElement.onclick = clickCard;
            }
        }
    }
}

const startGame = () => {
    DOM.createBoard(elements, suits, drawCard);
    DOM.updateMoves(elements.moves, state.totalMoves);
    Deck.initializeCards(state.cards, suits);
    Deck.addCards(state.deck, state.cards);
    DOM.addCards(state.cards, elements.board);
    DOM.addCardFaces(state.cards, suits);
    shuffle(state.deck);
    Deck.deal(state.deck, state.stacks);
    state.stacks.map(stack => DOM.zIndexCollection(stack));
    renderStacks();
}

const elements = {
    root: 'root',
    board: 'board',
    moves: 'moves',
    piles: 'piles',
    deck: 'deck',
    stacks: 'stacks',
    pile: {
        staves: 'pile_staves',
        swords: 'pile_swords',
        shields: 'pile_shields',
        towers: 'pile_towers',
    }
};
const suits = {
    staves: 'light',
    swords: 'dark',
    shields: 'dark',
    towers: 'light'
};

const state = {
    cards: {},
    drawnCards: [],
    visibleDrawnCards: 0,
    deck: [],
    piles: {
        staves: [],
        swords: [],
        shields: [],
        towers: [],
    },
    stacks: Array(7).fill([]),
    totalMoves: 0,
};

window.onload = () => {
    runTests();
    startGame();
}