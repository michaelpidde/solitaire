import { shuffle, scalarFindParentArray } from './modules/arrays.mjs'
import * as Deck from './modules/deck.mjs';
import * as DOM from './modules/dom.mjs';
import showDebugUI from './modules/debug.mjs';
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
    const cardsToHide = (state.drawnCards.length >= 3) ? 3 : state.drawnCards.length;
    for(let i = 0; i < cardsToHide; ++i) {
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

const updateDrawnCards = (cardElement) => {
    const drawPosition = state.drawnCards.indexOf(cardElement.id);
    state.drawnCards.splice(drawPosition, 1);

    if(state.drawnCards.length == 0 && state.deck.length == 0) {
        const deckElement = document.getElementById(elements.deck);
        deckElement.className = 'end';
        deckElement.onclick = null;
        return;
    }

    // Attach click event to prior drawn card (if there was one) so it can be played
    if(drawPosition > 0) {
        document.getElementById(state.drawnCards[drawPosition - 1]).onclick = clickCard;
    }
    // Re-render drawn cards
    DOM.updateDrawnCards(state.cards, state.drawnCards, elements, clickCard);
}

const updateStack = (card, cardElement, stack, cardsMoved = 1) => {
    stack.splice(stack.indexOf(cardElement.id), cardsMoved);

    // Flip next card in stack
    if(stack.length > 0) {
        const nextCardId = stack[stack.length - 1];
        const nextCard = state.cards[nextCardId];
        const nextCardElement = document.getElementById(nextCardId);
        nextCard.face = true;
        nextCardElement.className = Deck.cardClass(card);
        nextCardElement.onclick = clickCard;
    }
}

const clickCard = (event) => {
    const cardElement = (event.target.offsetParent.id == elements.board) ? event.target : event.target.offsetParent;
    let {suit, number} = Deck.cardFromId(cardElement.id);
    const pile = state.piles[suit];
    const card = state.cards[cardElement.id];
    
    const inDraw = state.drawnCards.indexOf(cardElement.id) > -1;
    const inStack = (inDraw) ? -1 : scalarFindParentArray(state.stacks, cardElement.id);
    const stackPulledFrom = (inStack > -1) ? state.stacks[inStack] : null;
    const positionInStack = (inStack > -1) ? stackPulledFrom.indexOf(cardElement.id) : null;
    const inPile = (inDraw || inStack > -1) ? false : true;
    let cardsMoved = 0;

    const moveCards = (toStack, toStackId) => {
        let cardsMoved = 0;

        if(inStack > -1) {
            // Pull cards off bottom of stack. If the last card in stack was clicked,
            // this loop will only run once.
            for(let c = positionInStack; c < stackPulledFrom.length; ++c) {
                toStack.push(stackPulledFrom[c]);
                ++cardsMoved;
            }
        } else if(inDraw || inPile) {
            // Pull card off deck or off pile
            toStack.push(cardElement.id);
            ++cardsMoved;
        }

        DOM.zIndexCollection(toStack);
        renderStacks(toStackId);

        if(inDraw) {
            updateDrawnCards(cardElement);
        }
        if(inStack > -1) {
            updateStack(card, cardElement, stackPulledFrom, cardsMoved);
        }
        if(inPile) {
            pile.pop();
        }

        return cardsMoved;
    }
    
    // Move card to pile if possible
    if(pile.length == number - 1) {
        // Check if card is in middle of stack from whence it cannot be promoted
        if(inStack == -1 || stackPulledFrom.indexOf(cardElement.id) == stackPulledFrom.length - 1) {
            const pileElement = document.getElementById(elements.pile[suit]);
            card.position.x = pileElement.offsetLeft;
            card.position.y = pileElement.offsetTop;
            cardElement.style.left = card.position.x + 'px';
            cardElement.style.top = card.position.y + 'px';

            pile.push(cardElement.id);
            DOM.zIndexCollection(pile);
            ++cardsMoved;

            if(inDraw) {
                updateDrawnCards(cardElement);
            }
            if(inStack > -1) {
                updateStack(card, cardElement, stackPulledFrom, cardsMoved);
            }
        }
    }

    // Move card to leftmost valid stack if possible, if it hasn't been moved to a pile
    if(cardsMoved == 0 && card.face) {
        const cardColor = suits[card.suit];
        let lastCard = null;
        let lastCardIndex = null;
        let lastCardSuit = null;
        let stack = null;
        for(let i = 0; i < state.stacks.length; ++i) {
            stack = state.stacks[i];
            if(stack.length > 0) {
                lastCardIndex = stack[stack.length - 1];
                lastCard = state.cards[lastCardIndex];
                lastCardSuit = suits[state.cards[lastCardIndex].suit];
                if(lastCardSuit != cardColor && lastCard.number == card.number + 1) {
                    cardsMoved = moveCards(stack, i);
                    break;
                }
            } else {
                if(card.number == 13) {
                    cardsMoved = moveCards(stack, i);
                    break;
                }
            }
        }
    }

    if(cardsMoved > 0) {
        incrementMoves();
    }
}

const incrementMoves = () => {
    ++state.totalMoves;
    DOM.updateMoves(elements.moves, state.totalMoves);
}

const renderStacks = (stackId = null) => {
    let stack = [];
    let increment = 0;
    let card = {};
    let cardElement = null;
    let lastCard = false;
    const leftOffset = 15;
    for(let i = 0; i < state.stacks.length; ++i) {
        if(stackId != null && i != stackId) {
            continue;
        }
        lastCard = false;
        increment = (110 + 15) * i; // card width + right margin
        stack = state.stacks[i];
        for(let j = 0; j < stack.length; ++j) {
            card = state.cards[stack[j]];
            card.position.x = increment + leftOffset;
            card.position.y = 200 + (j * 30); // Arbitrary numbers
            if(j == stack.length - 1) {
                // Last card should show face
                card.face = true;
            }
            cardElement = document.getElementById(stack[j]);
            cardElement.className = Deck.cardClass(card);
            cardElement.style.top = card.position.y + 'px';
            cardElement.style.left = card.position.x + 'px';
            if(card.visible) {
                cardElement.style.display = 'block';
            } else {
                cardElement.style.display = 'none';
            }
            if(card.visible) {
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
    showDebugUI(elements.root, state, _ => {
        // Add function references that debug functions need.
        state['functionRefs'] = {
            renderStacks: renderStacks,
        };
    });
    startGame();
}