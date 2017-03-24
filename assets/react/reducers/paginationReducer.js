const pagination = (state = {
    currPage: 0,
    prevBlocks: [],
    upperBlock: null }, action) => {
    switch (action.type){
        case 'PAGINATION_INIT':
            return {
                ...state,
                upperBlock: action.upperBlock,
                currBlock: null,
                currPage: 0
            };
        case 'PAGINATE_RIGHT':
            return {
                ...state,
                prevBlocks: [...state.prevBlocks, state.currBlock],
                currBlock: state.upperBlock,
                upperBlock: action.upperBlock,
                currPage: state.currPage + 1
            };
        case 'PAGINATE_LEFT':
            return {
                upperBlock: state.currBlock || null,
                currBlock: state.prevBlocks[state.prevBlocks.length - 1] || null,
                prevBlocks: [...state.prevBlocks.slice(0,-1)],
                currPage: state.currPage - 1
            };
        default:
            return state;
    }
};

export default pagination;