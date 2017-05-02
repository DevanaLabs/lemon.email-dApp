import React from 'react';

const Pagination = ({ paginationClick, pageNum, currentEmailsLoaded, goRight }) => (
  <div className="pagination-buttons">
    {/*<span className="pagination-page-number">Page {pageNum+1}</span>*/}
    {currentEmailsLoaded ? <span className="pagination-page-number">Messages {pageNum*10 +1} to { pageNum*10 + currentEmailsLoaded }</span> : ""}
    <button
      disabled={pageNum === 0}
      onClick={paginationClick.bind(null,-1)}
    >
      <i className="icon-arrow-left"></i>
    </button>
    <button
      disabled={goRight}
      onClick={paginationClick.bind(null,1)}
    >
      <i className="icon-arrow-right"></i>
    </button>
  </div>
);

Pagination.propTypes = {
  paginationClick: React.PropTypes.func.isRequired,
  pageNum: React.PropTypes.number.isRequired,
  goRight: React.PropTypes.bool.isRequired
};

export default Pagination;