import React from 'react';
import PropTypes from 'prop-types';
const Input = ({ name, label, error, value, ...rest }) => {
  return (
    <React.Fragment>
      <div className="bx--form-item">
        <label htmlFor={name} className="bx--label">
          {label}
        </label>
        <input
          {...rest}
          name={name}
          id={name}
          value={value}
          className={`bx--text-input required ${error ? 'data-invalid' : ''}`}
          placeholder={`Ingrese el ${label} aquí`}
        />
        <div className="bx--form-requirement">{error}</div>
      </div>
    </React.Fragment>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
  // value: PropTypes.string.isRequired //Puede ser number
};

export default Input;
