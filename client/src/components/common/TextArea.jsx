import React from 'react';
import PropTypes from 'prop-types';
const TextArea = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group">
      <label className="label " htmlFor={name}>
        {label}
      </label>
      <textarea
        {...rest}
        name={name}
        id={name}
        className={`
          form-control form-control-sm 
          ${error && 'is-invalid'}
        `}
      />
      {(error && <div className="invalid-feedback">{error}</div>) || (
        <div className="hidden">fix</div>
      )}
      {/* {error && (
        <div className="alert alert-danger col-sm-10 opacity">{error}</div>
      )} */}
    </div>
  );
};

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
  // value: PropTypes.string.isRequired //Puede ser number
};

export default TextArea;
