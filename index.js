import { shuffle, scalarFindParentArray } from './modules/arrays.mjs'
import * as Deck from './modules/deck.mjs';
import * as DOM from './modules/dom.mjs';
import showDebugUI from './modules/debug.mjs';
import runTests from './modules/tests.mjs';

const drawCard = () => {
    incrementMoves();
    if(state.visibleDrawnCards < 3) {
        ++state.visibleDrawnCards;
    }
    [state.deck, state.drawnCards] = Deck.draw(state.deck, state.drawnCards);
    DOM.updateDrawnCards(state.cards, state.drawnCards, state.visibleDrawnCards, elements, clickCard);

    if(state.deck.length == 0) {
        const deckElement = document.getElementById(elements.deck);
        deckElement.className = 'reset';
        deckElement.onclick = resetDeck;
    }
}

const resetDeck = () => {
    let card = null;
    let cardElement = null;
    state.visibleDrawnCards = 0;
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

// TODO: This Godmode function can probably be split up into events per card location,
// (event for card in stack, for card in deck, for card in pile) or into functions per event type
// (i.e. promotion to pile vs. moving between stacks vs. moving from drawn cards to a stack)
const clickCard = (event) => {
    const cardElement = (event.target.offsetParent.id == elements.board) ? event.target : event.target.offsetParent;
    let {suit, number} = Deck.cardFromId(cardElement.id);
    const pile = state.piles[suit];
    const card = state.cards[cardElement.id];
    
    const inDraw = state.drawnCards.indexOf(cardElement.id) > -1;
    const inStack = (inDraw) ? -1 : scalarFindParentArray(state.stacks, cardElement.id);
    const stackPulledFrom = (inStack > -1) ? state.stacks[inStack] : null;
    const positionInStack = (inStack > -1) ? state.stacks[inStack].indexOf(cardElement.id) : null;
    // TODO: Do we need this variable? (Yes, probably, so we can change the state
    // if we need to move a card out of the pile and back into a stack)
    const inPile = (inDraw || inStack > -1) ? false : true;

    let moved = false;
    let cardsMoved = 0;

    const updateDrawnCards = () => {
        const drawPosition = state.drawnCards.indexOf(cardElement.id);
        state.drawnCards.splice(drawPosition, 1);
        // Attach click event to prior drawn card (if there was one) so it can be played
        if(drawPosition > 0) {
            document.getElementById(state.drawnCards[drawPosition - 1]).onclick = clickCard;
        }
        // Re-render drawn cards
        --state.visibleDrawnCards;
        DOM.updateDrawnCards(state.cards, state.drawnCards, state.visibleDrawnCards, elements, clickCard);
    }

    const updateStack = (cardsMoved = 1) => {
        stackPulledFrom.splice(stackPulledFrom.indexOf(cardElement.id), cardsMoved);

        // Flip next card in stack
        if(stackPulledFrom.length > 0) {
            const nextCardId = stackPulledFrom[stackPulledFrom.length - 1];
            const nextCard = state.cards[nextCardId];
            const nextCardElement = document.getElementById(nextCardId);
            nextCard.face = true;
            nextCardElement.className = Deck.cardClass(card);
            nextCardElement.onclick = clickCard;
        }
    }
    
    // Move card to pile if possible
    if(pile.length == number - 1) {
        // Check if card is in middle of stack from whence it cannot be promoted
        if(inStack > -1 && state.stacks[inStack].indexOf(cardElement.id) != state.stacks[inStack].length - 1) {
            return;
        }
        const pileElement = document.getElementById(elements.pile[suit]);
        card.position.x = pileElement.offsetLeft;
        card.position.y = pileElement.offsetTop;
        cardElement.style.left = card.position.x + 'px';
        cardElement.style.top = card.position.y + 'px';

        pile.push(cardElement.id);
        DOM.zIndexCollection(pile);
        ++cardsMoved;

        if(inDraw) {
            updateDrawnCards();
        }
        if(inStack > -1) {
            updateStack(cardsMoved);
        }
    } else {
        // Move card to leftmost valid stack if possible
        const cardColor = suits[card.suit];
        let lastCard = null;
        let lastCardId = null;
        let lastCardSuit = null;
        let stack = null;
        for(let i = 0; i < state.stacks.length; ++i) {
            stack = state.stacks[i];
            if(stack.length > 0) {
                lastCardId = stack[stack.length - 1];
                lastCard = state.cards[lastCardId];
                lastCardSuit = suits[state.cards[lastCardId].suit];
                if(lastCardSuit != cardColor && lastCard.number == card.number + 1) {
                    if(inStack > -1) {
                        // Pull cards off bottom of stack. If the last card in stack was clicked,
                        // this loop will only run once.
                        for(let c = positionInStack; c < state.stacks[inStack].length; ++c) {
                            stack.push(state.stacks[inStack][c]);
                            ++cardsMoved;
                        }
                    } else {
                        // Pull card off deck
                        stack.push(cardElement.id);
                        ++cardsMoved;
                    }

                    DOM.zIndexCollection(stack);
                    renderStacks(i);
                    if(inDraw) {
                        updateDrawnCards();
                    }
                    if(inStack > -1) {
                        updateStack(cardsMoved);
                    }
                    moved = true;
                    break;
                }
            } else {
                if(card.number == 13) {
                    stack.push(cardElement.id);
                    ++cardsMoved;
                    DOM.zIndexCollection(stack);
                    renderStacks(i);
                    if(inDraw) {
                        updateDrawnCards();
                    }
                    if(inStack > -1) {
                        updateStack();
                    }
                    moved = true;
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
    visibleDrawnCards: 0,
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