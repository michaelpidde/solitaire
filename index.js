import { shuffle } from './modules/arrays.mjs'
import * as Deck from './modules/deck.mjs';
import * as DOM from './modules/dom.mjs';
import runTests from './modules/tests.mjs';

const drawCard = () => {
    incrementMoves();
    [state.deck, state.drawnCards] = Deck.draw(state.deck, state.drawnCards);
    DOM.updateDrawnCards(state.cards, state.drawnCards, elements, clickCard);

    if(state.deck.length == 0) {
        const deckElement = document.getElementById(elements.deck);
        deckElement.className = 'reset';
        deckElement.onclick = resetDeck;
    }
}

const resetDeck = () => {
    let card = null;
    let cardElement = null;
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

const clickCard = (event) => {
    const cardId = (event.target.offsetParent.id == elements.board) ?
        event.target.id : event.target.offsetParent.id;
    let {suit, number} = Deck.cardFromId(cardId);
    const pile = state.piles[suit];
    const card = null; // ?? Is it in the deck, drawnCards, or in a stack, or in a pile?
    
    // Move card to pile if possible
    if(state.piles[suit].length == number - 1) {
        const pileElement = document.getElementById(elements.piles[suit]);

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
    state.stacks.map(stack => DOM.zIndexStack(stack));
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