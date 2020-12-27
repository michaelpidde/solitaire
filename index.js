import { shuffle } from './modules/arrays.mjs'
import * as Deck from './modules/deck.mjs';
import * as DOM from './modules/dom.mjs';
import runTests from './modules/tests.mjs';

const drawCard = () => {
    incrementMoves();
    [deck, drawnCards] = Deck.draw(deck, drawnCards);
    if(deck.length == 0) {
        const deck = document.getElementById(elements.deck);
        deck.className = 'reset';
        deck.onclick = resetDeck;
    }
    if(drawnCards.length > 3) {
        // Shift cards in play stack (render bottom 3 cards)
    }
    // Set position and display based on drawnCards
    const container = document.getElementById(elements.board);
    drawnCards[drawnCards.length - 1].position.y = 15;
    drawnCards[drawnCards.length - 1].position.x = container.clientWidth - 350;
    drawnCards[drawnCards.length - 1].face = true;
    // Somehow reference active drawn card so it has a click handler that works and the others do not
}

const resetDeck = () => {
    deck = JSON.parse(JSON.stringify(drawnCards));
    drawnCards = [];
    const deckElement = document.getElementById(elements.deck);
    deckElement.className = 'cardback';
    deckElement.onclick = drawCard;
}

const clickCard = (card) => {
    //
}

const incrementMoves = () => {
    ++totalMoves;
    DOM.updateMoves(elements.moves, movesLiteral, totalMoves);
}

const startGame = () => {
    DOM.createBoard(elements, suits, drawCard);
    Deck.create(deck, suits);
    deck.map(card => DOM.addCardToDOM(card, elements.board));
    shuffle(deck);
    [deck, stacks] = Deck.deal(deck, stacks);
    stacks.map(stack => DOM.zIndexStack(stack));
    DOM.updateMoves(elements.moves, movesLiteral, totalMoves);

    let stack = [];
    let increment = 0;
    let card = {};
    let cardElement = null;
    const leftOffset = 15;
    for(let i = 0; i < stacks.length; ++i) {
        increment = (110 + 15) * i; // card width + right margin
        stack = stacks[i];
        for(let j = 0; j < stack.length; ++j) {
            card = stack[j];
            card.position.x = increment + leftOffset;
            card.position.y += j * 30;
            if(j == stack.length - 1) {
                card.face = true;
                DOM.createFace(card, suits);
            }
            cardElement = document.getElementById(Deck.cardId(stack[j]));
            cardElement.className = Deck.cardClass(card);
            cardElement.style.top = card.position.y + 200 + 'px';
            cardElement.style.left = card.position.x + 'px';
            cardElement.style.display = 'block';
        }
    }
}

let deck = [];
let drawnCards = [];
let stacks = Array(7).fill([]);
let totalMoves = 0;
let movesLiteral = 'Moves: ';
const elements = {
    root: 'root',
    board: 'board',
    moves: 'moves',
    piles: 'piles',
    deck: 'deck',
    stacks: 'stacks',
};
const suits = {
    staffs: 'light',
    swords: 'dark',
    shields: 'light',
    towers: 'dark'
};

window.onload = () => {
    runTests();
    startGame();
}