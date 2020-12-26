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
            suits: ['staffs', 'swords', 'shields', 'towers'],
        };
    }

    function test_removeFromDeck() {
        let {deck, suits, stacks} = setUp();
        Deck.create(deck, suits);
        const firstCard = JSON.parse(JSON.stringify(deck[0]));
        [deck, stacks[0]] = Deck.remove(deck, stacks[0], 0, 1);
        assert(deck.length == 51, 'Deck should contain 51 cards');
        assert(stacks[0].length == 1, 'First stack should contain 1 card');
        assert(
            stacks[0][0].suit == firstCard.suit && stacks[0][0].number == firstCard.number,
            'Stack card should match removed card'
        );
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
        test_removeFromDeck: test_removeFromDeck,
        test_createDeckAndDeal: test_createDeckAndDeal,
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