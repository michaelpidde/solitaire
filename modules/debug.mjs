import config from '../config.mjs';
import { zIndexCollection } from './dom.mjs';

let stateRef = null;

const logState = () => {
    console.log(stateRef);
}

const swordsInStacks = () => {
    console.log('DEBUG: Swords suit in stacks');
    stateRef.stacks = [
        ['swords_1'],
        ['swords_3', 'swords_2'],
        ['swords_6', 'swords_5', 'swords_4'],
        ['swords_10', 'swords_9', 'swords_8', 'swords_7'],
        ['swords_13', 'swords_12', 'swords_11'],
    ];
    // Hide every card
    for(let card in stateRef.cards) {
        stateRef.cards[card].visible = false;
        document.getElementById(card).style.display = 'none';
    };
    // Only make visible those cards now in stacks
    stateRef.stacks.map(stack => stack.map((cardId, stack) => {
        stateRef.cards[cardId].visible = true;
        stateRef.cards[cardId].face = false;
        // Only show faces of last card in stacks
        if(stateRef.stacks[stack][stack.length] - 1 == cardId) {
            stateRef.cards[cardId].face = true;
        }
    }));
    stateRef.stacks.map(stack => zIndexCollection(stack));
    stateRef.functionRefs.renderStacks();
}

const movePartialStack = () => {
    console.log('DEBUG: Partially movable stack');
    stateRef.stacks = [
        ['swords_6'],
        ['staves_2', 'staves_5', 'swords_4'],
    ];
    // Hide every card
    for(let card in stateRef.cards) {
        stateRef.cards[card].visible = false;
        document.getElementById(card).style.display = 'none';
    };
    // Only make visible those cards now in stacks
    stateRef.cards['swords_6'].visible = true;
    stateRef.cards['swords_6'].face = true;
    stateRef.cards['staves_2'].visible = true;
    stateRef.cards['staves_2'].face = false;
    stateRef.cards['staves_5'].visible = true;
    stateRef.cards['staves_5'].face = true;
    stateRef.cards['swords_4'].visible = true;
    stateRef.cards['swords_4'].face = true;
    stateRef.stacks.map(stack => zIndexCollection(stack));
    stateRef.functionRefs.renderStacks();
}

const showDebugUI = (root, state, callback) => {
    if(!config.debug) {
        return;
    }

    stateRef = state;

    const debugDiv = document.createElement('div');
    debugDiv.style.float = 'left';
    debugDiv.style.border = '1px solid black';
    debugDiv.style.backgroundColor = 'lightgray';

    const title = document.createElement('h3');
    title.style.color = 'black';
    title.innerHTML = 'Datasets';

    const swordsInStacksButton = document.createElement('button');
    swordsInStacksButton.innerHTML = 'Single suit';
    swordsInStacksButton.onclick = swordsInStacks;

    const movePartialStackButton = document.createElement('button');
    movePartialStackButton.innerHTML = 'Move partial stack';
    movePartialStackButton.onclick = movePartialStack;

    const logStateButton = document.createElement('button');
    logStateButton.innerHTML = 'Log State';
    logStateButton.onclick = logState;
    
    debugDiv.appendChild(title);
    debugDiv.appendChild(logStateButton);
    debugDiv.appendChild(document.createElement('br'));
    debugDiv.appendChild(swordsInStacksButton);
    debugDiv.appendChild(document.createElement('br'));
    debugDiv.appendChild(movePartialStackButton);
    document.getElementById(root).appendChild(debugDiv);

    callback();
}

export default showDebugUI;