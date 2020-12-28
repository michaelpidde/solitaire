export const shuffle = (array) => {
    const total = array.length;
    let random = 0;
    let temp = '';
    for(let i = 0; i < total; ++i) {
        // This will get a random number with the lower bound being iteratively higher. That is,
        // 0 - 51 the first time, then 1 - 51, 2 - 51, etc.
        random = Math.floor(Math.random() * (total - i)) + i;
        temp = array[random];
        // Shift element to start of array.
        array.splice(random, 1);
        array.unshift(temp);
    }
}

export const scalarEqual = (arr1, arr2) => {
    if(arr1.length != arr2.length) {
        return false;
    }
    for(let i = 0; i < arr1.length; ++i) {
        if(arr1[i] != arr2[i]) {
            return false;
        }
    }
    return true;
}