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
            deck: [],
            stacks: Array(7).fill([]),
            suits: ['staves', 'swords', 'shields', 'towers'],
        };
    }

    function test_createDeckAndDeal() {
        let {deck, suits, stacks} = setUp();
        Deck.create(deck, suits);

        const deckLength = deck.length;
        assert(deckLength == 52, 'Deck should contain 52 cards');
        
        [deck, stacks] = Deck.deal(deck, stacks);
        const dealt = Array.from(Array(7), (_, i) => ++i).reduce((a, b) => a + b);
        assert(deckLength == deck.length + dealt, 'Current deck length + dealt cards should total 52');
    }

    function test_cardId() {
        const {deck, suits} = setUp();
        Deck.create(deck, suits);
        const card = deck[0];
        assert(Deck.cardId(card) == card.suit + '_' + card.number, 'Card ID should be...correct');
    }

    function test_deckDraw() {
        let {deck, suits} = setUp();
        let drawnCards = [];
        Deck.create(deck, suits);

        const firstCard = JSON.parse(JSON.stringify(deck[0]));
        [deck, drawnCards] = Deck.draw(deck, drawnCards);
        assert(deck.length == 51, 'Deck should contain 51 cards after draw');
        assert(firstCard.suit == drawnCards[0].suit && firstCard.number == drawnCards[0].number,
            'First card from deck should match newest card in drawn pile');
        
            // Make sure second draw puts card in correct spot in drawnCards
        const secondCard = JSON.parse(JSON.stringify(deck[0]));
        [deck, drawnCards] = Deck.draw(deck, drawnCards);
        assert(deck.length == 50, 'Deck should contain 50 cards after draw');
        assert(secondCard.suit == drawnCards[1].suit && secondCard.number == drawnCards[1].number,
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

    return {
        get: get,
        test_createDeckAndDeal: test_createDeckAndDeal,
        test_cardId: test_cardId,
        test_deckDraw: test_deckDraw,
        test_compareArray: test_compareArray,
        test_shuffleArray: test_shuffleArray
    };
}();

const runTests = () => {
    if(config.runTests == true) {
        let tests = Tests.get();
        console.log('Running tests...');
        tests.forEach((test) => {
            ++testsRan;
            Tests[test]();
        });
        console.log(`Tests: ${testsRan}, Assertions: ${totalAssertions}, Failed: ${failedAssertions}`);
        console.log('Done.');
    }
}

export default runTests;