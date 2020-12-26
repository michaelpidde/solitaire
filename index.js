import { shuffle } from './modules/arrays.mjs'
import * as Deck from './modules/deck.mjs';
import runTests from './modules/tests.mjs';

const renderCard = (suit, index, face) => {
    console.log('renderCard');
    const root = document.getElementById(elements.board);
    const card = create({
        type: 'div',
        id: suit + '_' + index,
        className: face ? 'facecard ' + suit : 'cardback',
        style: {
            position: 'absolute',
            top: '100px',
            left: '100px',
        }
    });

    root.appendChild(card);
}

const renderStack = (column) => {
    //
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
    suits.map((suit) => {
        let pile = create({
            type: 'div',
            id: 'pile_' + suit,
            className: 'pile'
        });
        piles.appendChild(pile);
    });

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
    // Pop card off deck and put into drawnCards stack
    // If deck is now empty, render reset cards button (empty card outline that has reset icon)
    // If there are already 3 drawn cards, "shift" all of them (render bottom 3 of drawnCards stack)
    // Set position based on drawnCards
    // Somehow reference active drawn card so it has a click handler that works and the others do not
    renderCard(suits[1], 5, true);
}

const clickCard = (card) => {
    //
}

const incrementMoves = () => {
    ++totalMoves;
    document.getElementById(elements.moves).innerHTML = movesLiteral + totalMoves;
}

const startGame = () => {
    Deck.create(deck, suits);
    shuffle(deck);
    [deck, stacks] = Deck.deal(deck, stacks);
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
};
const suits = ['staffs', 'swords', 'shields', 'towers'];

window.onload = () => {
    runTests();
    renderBoard(document.getElementById('root'));
    startGame();
}