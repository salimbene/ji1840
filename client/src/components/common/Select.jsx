import React from 'react';

const Select = ({ name, label, options, altName, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} {...rest} className="form-control">
        <option value="" />
        {options.map(option => (
          <option key={option._id} value={option._id}>
            {option[altName]}
          </option>
        ))}
      </select>
      {(error && <div className="invalid-feedback">{error}</div>) || (
        <div className="hidden">fix</div>
      )}
    </div>
  );
};

export default Select;
