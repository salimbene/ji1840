import React from 'react';

const BtnAux = ({ label, onClick }) => {
  return (
    <button
      className="bx--btn bx--btn--sm bx--btn--secondary"
      onClick={onClick}
      type="button"
    >
      {` ${label}`}
      <svg
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        style={{ willChange: 'transform' }}
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
  );
};

export default BtnAux;
