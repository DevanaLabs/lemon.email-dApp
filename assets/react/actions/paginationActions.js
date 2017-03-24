export const paginate = (direction, upperBlock, dispatch) => {
    if(direction === 0) {
        dispatch(blockInit(upperBlock));
        return;
    }
    direction === 1 ? dispatch(pageRight(upperBlock)) : dispatch(pageLeft(upperBlock));
};

export const blockInit = (upperBlock) => {
    return {
        type: 'PAGINATION_INIT',
        upperBlock
    }
};

export const pageRight = (upperBlock) => {
    return {
        type: 'PAGINATE_RIGHT',
        upperBlock
    }
};

export const pageLeft = (upperBlock) => {
    return {
        type: 'PAGINATE_LEFT',
        upperBlock
    }
};