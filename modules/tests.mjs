import config from '../config.mjs';
import * as Arrays from './arrays.mjs';
import * as Deck from './deck.mjs';

let totalAssertions = 0;
let failedAssertions = 0;
let testsRan = 0;

const assert = (condition, message) => {
    if(!condition) {
        ++failedAssertions;
        console.error(message);
    }
    ++totalAssertions;
}

var Tests = function() {
    function get() {
        let funcs = [];
        for(var item in this) {
            if(this.hasOwnProperty(item) && this[item] instanceof Function && /test_/i.test(item)) {
                funcs.push(item);
            }
        }
        return funcs;
    }

    function setUp() {
        return {
            state: {
                cards: {},
                deck: [],
                drawnCards: [],
                stacks: Array(7).fill([]),
            },
            suits: {
                staves: 'light',
                swords: 'dark',
                shields: 'dark',
                towers: 'light'
            },
        };
    }

    function createDeck() {
        const {state, suits} = setUp();
        Deck.initializeCards(state.cards, suits);
        Deck.addCards(state.deck, state.cards);
        return state;
    }

    function test_createDeckAndDeal() {
        let {state, suits} = setUp();
        Deck.initializeCards(state.cards, suits);
        const cardsLength = Object.keys(state.cards).length;
        assert(cardsLength == 52, 'There should be 52 cards in state');

        Deck.addCards(state.deck, state.cards);
        const deckLength = state.deck.length;
        assert(deckLength == 52, 'Deck should contain 52 cards');
        
        Deck.deal(state.deck, state.stacks);
        const dealt = Array.from(Array(7), (_, i) => ++i).reduce((a, b) => a + b);
        assert(deckLength == state.deck.length + dealt, 'Current deck length + dealt cards should total 52');
    }

    function test_cardId() {
        const {state, suits} = setUp();
        Deck.initializeCards(state.cards, suits);
        Deck.addCards(state.deck, state.cards);
        const card = state.deck[0];
        assert(Deck.cardId(card) == card.suit + '_' + card.number, 'Card ID should be...correct');
    }

    function test_transformNumber() {
        const result = Array.from(Array(13), (_, i) => ++i)
            .map(i => i = Deck.transformNumber(i));
        assert(result.join('') == 'A2345678910JQK', 'Transformed card numbers should represent correct courts')
    }

    function test_cardClass() {
        const card = {
            suit: 'Beezneez',
            number: 6,
            face: false,
        };
        assert(Deck.cardClass(card) == 'card cardback', 'Card class should match expected card back class');
        card.face = true;
        assert(Deck.cardClass(card) == 'card facecard Beezneez', 'Card class should match expected face card class');
    }

    function test_deckDraw() {
        const state = createDeck();

        const firstCard = state.deck[0];
        Deck.draw(state.deck, state.drawnCards);
        assert(state.deck.length == 51, 'Deck should contain 51 cards after draw');
        assert(firstCard.suit == state.drawnCards[0].suit && firstCard.number == state.drawnCards[0].number,
            'First card from deck should match newest card in drawn pile');
        
            // Make sure second draw puts card in correct spot in drawnCards
        const secondCard = state.deck[0];
        Deck.draw(state.deck, state.drawnCards);
        assert(state.deck.length == 50, 'Deck should contain 50 cards after draw');
        assert(secondCard.suit == state.drawnCards[1].suit && secondCard.number == state.drawnCards[1].number,
            'Second card from deck should match newest card in drawn pile');
    }

    function test_compareArray() {
        const arr1 = [0, 1, 2, 'test'];
        const arr2 = [0, 1, 2, 'test'];
        const arr3 = [100, 111, 222];
        assert(Arrays.scalarEqual(arr1, arr2), 'Arrays should be equal');
        assert(!Arrays.scalarEqual(arr1, arr3), 'Arrays should not be equal');
    }

    function test_shuffleArray() {
        const sortedArray = Array.from(Array(10), (_, i) => ++i);
        const dupArray = JSON.parse(JSON.stringify(sortedArray));
        assert(Arrays.scalarEqual(sortedArray, dupArray), 'Test arrays are not equal to start');
        Arrays.shuffle(dupArray);
        assert(!Arrays.scalarEqual(sortedArray, dupArray), 'Test arrays are equal after shuffle');
    }

    function test_scalarFindParentArray() {
        const array = [
            ['val1', 'val2', 'val3'],
            ['val4', 'val5', 'val6'],
        ];
        assert(Arrays.scalarFindParentArray(array, 'val2') == 0, 'Should return 0 (first child array index)');
        assert(Arrays.scalarFindParentArray(array, 'val5') == 1, 'Should return 1 (second child array index)');
        assert(Arrays.scalarFindParentArray(array, 'no') == -1, 'Should return -1 (invalid array index)');
    }

    return {
        get: get,
        test_createDeckAndDeal: test_createDeckAndDeal,
        test_cardId: test_cardId,
        test_transformNumber: test_transformNumber,
        test_cardClass: test_cardClass,
        test_deckDraw: test_deckDraw,
        test_compareArray: test_compareArray,
        test_shuffleArray: test_shuffleArray,
        test_scalarFindParentArray: test_scalarFindParentArray,
    };
}();

const runTests = () => {
    if(config.runTests == true) {
        let tests = Tests.get();
        console.log('Running tests...');
        tests.forEach((test) => {
            ++testsRan;
            console.log('\t' + test);
            Tests[test]();
        });
        console.log(`Tests: ${testsRan}, Assertions: ${totalAssertions}, Failed: ${failedAssertions}`);
        console.log('Done.');
    }
}

export default runTests;