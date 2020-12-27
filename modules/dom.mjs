import { transformNumber, cardClass, cardId } from './deck.mjs';

export const addCardToDOM = (card, board) => {
    const root = document.getElementById(board);
    const cardElement = create({
        type: 'div',
        id: card.suit + '_' + card.number,
        className: cardClass(card),
        style: {
            display: 'none',
            position: 'absolute',
            top: card.position.y + 'px',
            left: card.position.x + 'px',
        }
    });

    root.appendChild(cardElement);
}

export const zIndexStack = (stack) => {
    let zindex = 0;
    stack.map((card, zindex) => {
        document.getElementById(cardId(card)).style.zIndex = zindex++;
    });
}

export const create = (attrs) => {
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

export const createBoard = (elements, suits, drawCardEvent) => {
    const root = document.getElementById(elements.root);
    const board = create({type: 'div', id: elements.board});
    const moves = create({type: 'div', id: elements.moves});
    const piles = create({type: 'div', id: elements.piles});
    for(let key in suits) {
        let pile = create({
            type: 'div',
            id: 'pile_' + key,
            className: 'pile',
            innerHTML: '<img>',
        });
        piles.appendChild(pile);
    };

    const deck = create({
        type: 'div',
        id: elements.deck,
        className: 'cardback',
        onclick: drawCardEvent,
    });
    
    board.appendChild(deck);
    board.appendChild(piles);
    board.appendChild(moves);
    root.appendChild(board);
}

export const createFace = (card, suits) => {
    const cardElement = document.getElementById(cardId(card));
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

export const updateMoves = (element, literal, moves) =>
    document.getElementById(element).innerHTML = literal + moves;