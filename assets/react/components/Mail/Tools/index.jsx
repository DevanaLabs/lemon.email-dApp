import React from 'react';

import PaginationButtons from './Pagination/';

const Tools = React.createClass({
    pagination(pageNum){
        const currBlock = this.props.pagination.upperBlock || null;
        const prevBlock = this.props.pagination.prevBlocks.slice(-1).pop() || null;
        const urlLocation = this.props.urlLocation;

        this.props.fetchMails(urlLocation, currBlock, prevBlock, pageNum);
    },
    render(){
        const pageNum = this.props.pagination.currPage || 0;
        const disableGoRight = this.props.mailData.mails.length < 10;

        return(
            <div className="tools">
                <PaginationButtons
                    paginationClick={this.pagination}
                    pageNum={pageNum}
                    currentEmailsLoaded={this.props.mailData.mails.length}
                    goRight={disableGoRight}/>
            </div>
        )
    }
});

Tools.propTypes = {
    pagination: React.PropTypes.shape({
        upperBlock: React.PropTypes.number,
        prevBlocks: React.PropTypes.array
    }).isRequired,
    urlLocation: React.PropTypes.string.isRequired,
    mailData: React.PropTypes.object
};

export default Tools;