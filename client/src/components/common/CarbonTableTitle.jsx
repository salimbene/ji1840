import React, { Fragment } from 'react';

const CarbonTableTitle = ({ title, btnLabel, btnClick }) => {
  return (
    <Fragment>
      <div className="bx--data-table-header">
        <h4 className="bx--data-table-header__title">{title}</h4>
        <p className="bx--data-table-header__description">ñaña</p>
      </div>
      <section className="bx--table-toolbar ">
        <div className="bx--toolbar-content">
          <button
            className="bx--btn bx--btn--sm bx--btn--primary"
            onClick={event => btnClick(event)}
            type="button"
          >
            {btnLabel}
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              // style="will-change: transform;"
              xmlns="http://www.w3.org/2000/svg"
              className="bx--btn__icon"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M17 15V7h-2v8H7v2h8v8h2v-8h8v-2h-8z" />
            </svg>
          </button>
        </div>
      </section>
    </Fragment>
  );
};

export default CarbonTableTitle;
