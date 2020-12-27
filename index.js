import { shuffle } from './modules/arrays.mjs'
import * as Deck from './modules/deck.mjs';
import * as DOM from './modules/dom.mjs';
import runTests from './modules/tests.mjs';

const drawCard = () => {
    incrementMoves();
    [deck, drawnCards] = Deck.draw(deck, drawnCards);
    updateDrawnCards();

    if(deck.length == 0) {
        const deck = document.getElementById(elements.deck);
        deck.className = 'reset';
        deck.onclick = resetDeck;
    }
}

const updateDrawnCards = () => {
    const container = document.getElementById(elements.board);
    const topOffset = 15;
    const leftOffset = container.clientWidth - 355;
    const offsetBetweenCards = 62;
    let card = null;
    drawnCards.reverse();
    for(let i = 0; i <= 3; ++i) {
        if(drawnCards.length - 1 >= i) {
            drawnCards[i].position.x = leftOffset - (offsetBetweenCards * i);
            drawnCards[i].position.y = topOffset;
            drawnCards[i].face = true;

            card = document.getElementById(Deck.cardId(drawnCards[i]));
            card.style.top = drawnCards[i].position.y + 'px';
            card.style.left = drawnCards[i].position.x + 'px';
            card.className = Deck.cardClass(drawnCards[i]);
            card.style.zIndex = 10 - i;
            card.style.display = 'block';
            
            if(i == 3) {
                card.style.display = 'none';
            }
        }
    }
    drawnCards.reverse();

    // Somehow reference active drawn card so it has a click handler that works and the others do not
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
    // Render faces for remaining deck cards
    deck.map(card => DOM.createFace(card, suits));
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
    staves: 'light',
    swords: 'dark',
    shields: 'light',
    towers: 'dark'
};

window.onload = () => {
    runTests();
    startGame();
}