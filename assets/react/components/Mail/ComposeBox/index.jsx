import React from 'react';
import Compose from '../../containers/ComposeMail';

const ComposeBox = ({composers, removeBox, toggleBox}) => (
    <div className="compose-boxes">
        {composers.map((item,i) =>
            <Compose
                item={item}
                key={item.mail.creationTimeHash}
                toggleBox={toggleBox}
                removeBox={removeBox}
                index={i}/>
        )}
    </div>
);

ComposeBox.propTypes = {
    composers: React.PropTypes.array.isRequired,
    removeBox: React.PropTypes.func.isRequired,
    toggleBox: React.PropTypes.func.isRequired
};

export default ComposeBox;