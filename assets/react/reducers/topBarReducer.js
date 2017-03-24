const topBar = (state = { toggled: false }, action) => {
    switch (action.type){
        case 'TOP_MENU_TOGGLE':
            return {
                ...state,
                toggled: !state.toggled
            };
        default:
            return state;
    }
};

export default topBar;