export const add_compose_box = (mail) => {
    return {
        type: 'NEW_COMPOSE_BOX',
        mail
    }
};

export const remove_compose_box = (index, e) => {
    if(e){
        e.stopPropagation();
    }
    return {
        type: 'REMOVE_COMPOSE_BOX',
        index
    }
};

export const toggle_box = (index) => {
    return {
        type: 'TOGGLE_COMPOSE_BOX',
        index
    }
};