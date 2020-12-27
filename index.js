import { shuffle } from './modules/arrays.mjs'
import * as Deck from './modules/deck.mjs';
import * as DOM from './modules/dom.mjs';
import runTests from './modules/tests.mjs';

const drawCard = () => {
    incrementMoves();
    [deck, drawnCards] = Deck.draw(deck, drawnCards);
    DOM.updateDrawnCards(drawnCards, elements, clickCard);

    if(deck.length == 0) {
        const deck = document.getElementById(elements.deck);
        deck.className = 'reset';
        deck.onclick = resetDeck;
    }
}

const resetDeck = () => {
    let card = null;
    let cardElement = null;
    for(let i = 0; i <= 2; ++i) {
        card = drawnCards[drawnCards.length - (1 + i)];
        cardElement = document.getElementById(Deck.cardId(card));
        cardElement.style.display = 'none';
    }

    deck = JSON.parse(JSON.stringify(drawnCards));
    drawnCards = [];
    const deckElement = document.getElementById(elements.deck);
    deckElement.className = 'cardback';
    deckElement.onclick = drawCard;
}

const clickCard = (event) => {
    const cardId = (event.target.offsetParent.id == elements.board) ?
        event.target.id : event.target.offsetParent.id;
    let {suit, number} = Deck.cardFromId(cardId);
    const pile = piles[suit];
    const card = null; // ?? Is it in the deck, drawnCards, or in a stack, or in a pile?
    
    // Move card to pile if possible
    if(piles[suit].length == number - 1) {
        const pileElement = document.getElementById(elements.piles[suit]);

    }

    // Else move card to leftmost valid stack, re-zindex
    // If moved:
    // - increase moves
    // - flip next card in stack if there are more 
}

const incrementMoves = () => {
    ++totalMoves;
    DOM.updateMoves(elements.moves, movesLiteral, totalMoves);
}

const renderStacks = () => {
    let stack = [];
    let increment = 0;
    let card = {};
    let cardElement = null;
    let lastCard = false;
    const leftOffset = 15;
    for(let i = 0; i < stacks.length; ++i) {
        lastCard = false;
        increment = (110 + 15) * i; // card width + right margin
        stack = stacks[i];
        for(let j = 0; j < stack.length; ++j) {
            if(j == stack.length - 1) {
                lastCard = true;
            }
            card = stack[j];
            card.position.x = increment + leftOffset;
            card.position.y += j * 30;
            if(lastCard) {
                card.face = true;
                DOM.createFace(card, suits);
            }
            cardElement = document.getElementById(Deck.cardId(stack[j]));
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
    DOM.updateMoves(elements.moves, movesLiteral, totalMoves);
    Deck.create(deck, suits);
    deck.map(card => DOM.addCardToDOM(card, elements.board));
    shuffle(deck);
    [deck, stacks] = Deck.deal(deck, stacks);
    // Render faces for remaining deck cards
    deck.map(card => DOM.createFace(card, suits));
    stacks.map(stack => DOM.zIndexStack(stack));
    renderStacks();
}

let deck = [];
let drawnCards = [];
let piles = {
    staves: [],
    swords: [],
    shields: [],
    towers: [],
}
let stacks = Array(4).fill([]);
let totalMoves = 0;
let movesLiteral = 'Moves: ';
const elements = {
    root: 'root',
    board: 'board',
    moves: 'moves',
    piles: 'piles',
    deck: 'deck',
    stacks: 'stacks',
    piles: {
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

window.onload = () => {
    runTests();
    startGame();
}