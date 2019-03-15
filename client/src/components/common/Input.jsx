import React from 'react';
import PropTypes from 'prop-types';
const Input = ({ name, label, error, value, ...rest }) => {
  return (
    <div className="form-group m-1">
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <input
        {...rest}
        name={name}
        id={name}
        value={value}
        className={`
          form-control form-control-sm 
          ${error ? 'is-invalid' : value && 'is-valid'}
        `}
        placeholder={label}
      />
      {(error && <div className="invalid-feedback">{error}</div>) || (
        <div className="hidden">fix</div>
      )}
    </div>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
  // value: PropTypes.string.isRequired //Puede ser number
};

export default Input;
