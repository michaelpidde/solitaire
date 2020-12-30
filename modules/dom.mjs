import { transformNumber, cardClass, cardId } from './deck.mjs';

export const addCards = (cards, board) => {
    const root = document.getElementById(board);
    for(let card in cards) {
        const cardElement = create({
            type: 'div',
            id: cards[card].suit + '_' + cards[card].number,
            className: cardClass(cards[card]),
            style: {
                display: 'none',
                position: 'absolute',
                top: cards[card].position.y + 'px',
                left: cards[card].position.x + 'px',
            }
        });
    
        root.appendChild(cardElement);
    };
}

export const zIndexCollection = (collection) => {
    let zindex = 0;
    collection.map((card, zindex) => {
        document.getElementById(card).style.zIndex = zindex++;
    });
}

export const updateDrawnCards = (cards, drawnCards, elements, cardClickEvent) => {
    const container = document.getElementById(elements.board);
    const topOffset = 15;
    const leftOffset = container.clientWidth - 355; // Arbitrary number for alignment
    const offsetBetweenCards = 62; // Arbitrary number for alignment
    let cardElement = null;
    let card = null;
    drawnCards.reverse();
    for(let i = 0; i <= 3; ++i) {
        if(drawnCards.length - 1 >= i) {
            card = cards[drawnCards[i]];
            card.position.x = leftOffset - (offsetBetweenCards * i);
            card.position.y = topOffset;
            card.face = true;

            cardElement = document.getElementById(drawnCards[i]);
            cardElement.style.top = card.position.y + 'px';
            cardElement.style.left = card.position.x + 'px';
            cardElement.className = cardClass(card);
            cardElement.style.zIndex = 10 - i;
            cardElement.style.display = 'block';

            if(i == 0) {
                cardElement.onclick = cardClickEvent;
            } else {
                cardElement.onclick = null;
            }

            if(i == 3) {
                cardElement.style.display = 'none';
            }
        }
    }
    drawnCards.reverse();
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
            id: elements.pile[key],
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

export const addCardFaces = (cards, suits) => {
    for(let card in cards) {
        const cardElement = document.getElementById(cardId(cards[card]));
        const title = create({
            type: 'div',
            innerHTML: transformNumber(cards[card].number) + '<span>' + cards[card].suit.toUpperCase() + '</span>',
            className: suits[cards[card].suit] + ' title ' + cards[card].suit
        });
        const image = create({
            type: 'img',
            width: 80,
            height: 80,
            src: 'images/' + cards[card].suit + '.svg'
        })
        cardElement.appendChild(title);
        cardElement.appendChild(image);
    };
}

export const updateMoves = (element, moves) =>
    document.getElementById(element).innerHTML = 'Moves: ' + moves;