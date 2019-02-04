import React from 'react';

const Input = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group">
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <input
        {...rest}
        name={name}
        id={name}
        className={`
          form-control 
          ${error && 'is-invalid'}
        `}
      />
      {error && <div className="invalid-feedback">{error}</div>}
      {/* {error && (
        <div className="alert alert-danger col-sm-10 opacity">{error}</div>
      )} */}
    </div>
  );
};

export default Input;
