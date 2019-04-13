import React from 'react';

const CarbonModal = ({
  isOpen,
  toggle,
  cancelBtnLabel,
  submitBtnLabel,
  title,
  label,
  submit,
  body,
  danger
}) => {
  return (
    <div
      id="cc-carbon-modal"
      className={`bx--modal ${isOpen ? 'is-visible' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cc-carbon-modal-label"
      aria-describedby="cc-carbon-modal-heading"
      tabIndex="-1"
    >
      <div className="bx--modal-container">
        <div className="bx--modal-header">
          <p
            className="bx--modal-header__label bx--type-delta"
            id="cc-carbon-modal-label"
          >
            {label}
          </p>
          <p
            className="bx--modal-header__heading bx--type-beta"
            id="cc-carbon-modal-heading"
          >
            {title}
          </p>
          <button
            className="bx--modal-close"
            type="button"
            aria-label="close modal"
            onClick={toggle}
          >
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              style={{ willChange: 'transform' }}
              xmlns="http://www.w3.org/2000/svg"
              className="bx--modal-close__icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M12 4.7l-.7-.7L8 7.3 4.7 4l-.7.7L7.3 8 4 11.3l.7.7L8 8.7l3.3 3.3.7-.7L8.7 8z" />
            </svg>
          </button>
        </div>
        <div className="bx--modal-content">{body} </div>
        <div className="bx--modal-footer">
          <button
            className="bx--btn bx--btn--secondary"
            type="button"
            onClick={toggle}
          >
            {cancelBtnLabel}
          </button>
          <button
            className={`bx--btn bx--btn--${danger ? 'danger' : 'primary'}`}
            type="button"
            aria-label={`${danger ? 'danger' : 'primary'}`}
            onClick={submit}
          >
            {submitBtnLabel}
          </button>{' '}
        </div>{' '}
      </div>
    </div>
  );
};

export default CarbonModal;
