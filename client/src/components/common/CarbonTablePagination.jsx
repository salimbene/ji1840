import React from 'react';
import _ from 'lodash';

const CarbonTablePagination = ({
  itemsCount,
  pageSize,
  currentPage,
  onPageChange,
  onPageSize
}) => {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  const pages = _.range(1, pagesCount + 1);

  if (pagesCount === 1) return null;

  return (
    <div className="bx--pagination" data-pagination>
      <div className="bx--pagination__left">
        <label
          id="select-id-pagination-count-label"
          className="bx--pagination__text"
          htmlFor="select-id-pagination-count"
        >
          Items por página:
        </label>
        <div className="bx--select bx--select--inline bx--select__item-count">
          <select
            className="bx--select-input"
            id="select-id-pagination-count"
            aria-label="select number of items per page"
            tabIndex="0"
            data-items-per-page
            onChange={event => onPageSize(event)}
            value={pageSize}
          >
            <option className="bx--select-option" value="10">
              10
            </option>
            <option className="bx--select-option" value="20">
              20
            </option>
            <option className="bx--select-option" value="30">
              30
            </option>
            <option className="bx--select-option" value="40">
              40
            </option>
            <option className="bx--select-option" value="50">
              50
            </option>
          </select>
          <svg
            focusable="false"
            // preserveAspectRatio="xMidYMid meet"
            // style={{will-change: transform}}
            xmlns="http://www.w3.org/2000/svg"
            className="bx--select__arrow"
            width="10"
            height="6"
            viewBox="0 0 10 6"
            aria-hidden="true"
          >
            <path d="M5 6L0 1 .7.3 5 4.6 9.3.3l.7.7z" />
          </svg>
        </div>
        <span className="bx--pagination__text">
          <span data-displayed-item-range>1-10</span> de{' '}
          <span data-total-items>{itemsCount}</span> items
        </span>
      </div>
      <div className="bx--pagination__right">
        <div className="bx--select bx--select--inline bx--select__page-number">
          <select
            className="bx--select-input"
            id="select-id-pagination-page"
            aria-label="select page number to view"
            tabIndex="0"
            data-page-number-input
            onChange={event => onPageChange(event)}
            value={currentPage}
          >
            {pages.map((p, i) => (
              <option className="bx--select-option" value={p} key={i}>
                {p}
              </option>
            ))}
          </select>
          <svg
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            // style="will-change: transform;"
            xmlns="http://www.w3.org/2000/svg"
            className="bx--select__arrow"
            width="10"
            height="6"
            viewBox="0 0 10 6"
            aria-hidden="true"
          >
            <path d="M5 6L0 1 .7.3 5 4.6 9.3.3l.7.7z" />
          </svg>
        </div>
        <label
          id="select-id-pagination-page-label"
          className="bx--pagination__text"
          htmlFor="select-id-pagination-page"
        >
          de {pagesCount} páginas
        </label>
        <button
          id="left"
          className="bx--pagination__button bx--pagination__button--backward"
          tabIndex="0"
          data-page-backward
          aria-label="Backward button"
          onClick={event => onPageChange(event, -1)}
        >
          <svg
            id="left"
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            // style="will-change: transform;"
            xmlns="http://www.w3.org/2000/svg"
            className="bx--pagination__nav-arrow"
            width="20"
            height="20"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="M19 23l-8-7 8-7v14z" />
          </svg>
        </button>
        <button
          id="right"
          className="bx--pagination__button bx--pagination__button--forward"
          tabIndex="0"
          data-page-forward
          aria-label="Forward button"
          onClick={event => onPageChange(event, 1, pagesCount)}
        >
          <svg
            id="right"
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            // style="will-change: transform;"
            xmlns="http://www.w3.org/2000/svg"
            className="bx--pagination__nav-arrow"
            width="20"
            height="20"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="M13 9l8 7-8 7V9z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CarbonTablePagination;
