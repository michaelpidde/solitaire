import { shuffle } from './modules/arrays.mjs'
import * as Deck from './modules/deck.mjs';
import runTests from './modules/tests.mjs';

const addCardToDOM = (card) => {
    const root = document.getElementById(elements.board);
    const cardElement = create({
        type: 'div',
        id: card.suit + '_' + card.number,
        className: Deck.cardClass(card),
        style: {
            display: 'none',
            position: 'absolute',
            top: card.position.y + 'px',
            left: card.position.x + 'px',
        }
    });

    root.appendChild(cardElement);
}

const zIndexStack = (stack) => {
    let zindex = 0;
    stack.map((card, zindex) => {
        document.getElementById(Deck.cardId(card)).style.zIndex = zindex++;
    });
}

const create = (attrs) => {
    if(attrs.type == undefined) {
        console.error('Must supply type');
        return;
    }
    const element = document.createElement(attrs.type);
    Object.assign(element, attrs);
    if(attrs.style != undefined) {
        Object.assign(element.style, attrs.style);
    }
    return element;
}

const renderBoard = (root) => {
    const board = create({type: 'div', id: elements.board});
    const moves = create({type: 'div', id: elements.moves, innerHTML: movesLiteral + totalMoves});
    const piles = create({type: 'div', id: elements.piles});
    for(let key in suits) {
        let pile = create({
            type: 'div',
            id: 'pile_' + suits[key].suit,
            className: 'pile'
        });
        piles.appendChild(pile);
    };

    const deck = create({
        type: 'div',
        id: elements.deck,
        className: 'cardback',
        onclick: drawCard,
    });
    
    board.appendChild(deck);
    board.appendChild(piles);
    board.appendChild(moves);
    root.appendChild(board);
}

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
    document.getElementById(elements.moves).innerHTML = movesLiteral + totalMoves;
}

const renderFace = (card) => {
    const cardElement = document.getElementById(Deck.cardId(card));
    const transformNumber = (number) => {
        if(number == 1) { return 'A' }
        if(number == 11) { return 'J' }
        if(number == 12) { return 'Q' }
        if(number == 13) { return 'K' }
        return number;
    }
    const title = create({
        type: 'div',
        innerHTML: transformNumber(card.number) + '<span>' + card.suit.toUpperCase() + '</span>',
        className: suits[card.suit] + ' title ' + card.suit
    });
    const image = create({
        type: 'img',
        width: 80,
        height: 80,
        src: 'images/' + card.suit + '.svg'
    })
    cardElement.appendChild(title);
    cardElement.appendChild(image);
}

const startGame = () => {
    Deck.create(deck, suits);
    deck.map(card => addCardToDOM(card));
    shuffle(deck);
    [deck, stacks] = Deck.deal(deck, stacks);
    stacks.map(stack => zIndexStack(stack));

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
                renderFace(card);
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
    renderBoard(document.getElementById('root'));
    startGame();
}