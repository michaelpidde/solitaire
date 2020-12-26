import * as Arrays from './arrays.mjs';

export const RUN = true;

export const test_compareArray = () => {
    const arr1 = [0, 1, 2, 'test'];
    const arr2 = [0, 1, 2, 'test'];
    const arr3 = [100, 111, 222];
    console.assert(Arrays.scalarEqual(arr1, arr2), 'Arrays should be equal');
    console.assert(!Arrays.scalarEqual(arr1, arr3), 'Arrays should not be equal');
}

export const test_shuffleArray = () => {
    const sortedArray = Array.from(Array(10), (_, i) => ++i);
    const dupArray = JSON.parse(JSON.stringify(sortedArray));
    console.assert(Arrays.scalarEqual(sortedArray, dupArray), 'Test arrays are not equal to start');
    Arrays.shuffle(dupArray);
    console.assert(!Arrays.scalarEqual(sortedArray, dupArray), 'Test arrays are equal after shuffle');
}