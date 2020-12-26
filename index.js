import { shuffle } from './modules/arrays.mjs'
import * as Tests from './modules/tests.mjs';

const renderCard = (suit, index, face) => {
    const root = document.getElementById(elements.board);
    const card = document.createElement('div');
    card.id = suit + '_' + index;
    if(face) {
        card.className = 'facecard ' + suit;
    } else {
        card.className = 'cardback';
    }

    root.appendChild(card);
}

const renderStack = (column) => {
    //
}

const renderBoard = (root) => {
    const board = document.createElement('div');
    board.id = elements.board;

    const moves = document.createElement('div');
    moves.id = elements.moves;

    const piles = document.createElement('div');
    piles.id = elements.piles;
    suits.map((suit) => {
        let pile = document.createElement('div');
        pile.id = 'pile_' + suit;
        pile.className = 'pile';
        piles.appendChild(pile);
    });

    const deck = document.createElement('div');
    deck.id = elements.deck;
    deck.className = 'cardback';
    deck.onclick = drawCard;
    
    board.appendChild(deck);
    board.appendChild(piles);
    board.appendChild(moves);
    root.appendChild(board);
}

const drawCard = () => {
    incrementMoves();
    console.log('draw card');
}

const clickCard = (card) => {
    //
}

const incrementMoves = () => {
    ++moves;
    document.getElementById(elements.moves).innerHTML = 'Moves: ' + moves;
}

const startGame = () => {
    incrementMoves();
    shuffle(deck);
}

const elements = {
    board: 'board',
    moves: 'moves',
    piles: 'piles',
    deck: 'deck',
};
const suits = ['staffs', 'swords', 'shields', 'towers'];
const deck = [];
suits.map((suit) => {
    for(let i = 1; i <= 13; ++i) {
        deck.push({
            face: false,
            suit: suit,
            number: i,
        });
    }
});
const stacks = Array(7).fill([]);
let moves = -1;

window.onload = () => {
    renderBoard(document.getElementById('root'));
    if(Tests.RUN) {
        Tests.test_compareArray();
        Tests.test_shuffleArray();
    }
    startGame();
}