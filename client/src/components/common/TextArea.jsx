import React from 'react';
import PropTypes from 'prop-types';
const TextArea = ({ name, label, error, ...rest }) => {
  return (
    <div className="bx--form-item">
      <label className="bx--label " htmlFor={name}>
        {label}
      </label>
      <textarea
        {...rest}
        name={name}
        id={name}
        className="bx--text-area bx--text-area--v2"
      />
    </div>
  );
};

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
  // value: PropTypes.string.isRequired //Puede ser number
};

export default TextArea;
