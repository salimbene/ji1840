import React from 'react';
import PropTypes from 'prop-types';

const Select = ({ name, label, options, field, error, getId, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} {...rest} className="form-control">
        <option value="" />
        {options.map((option, index) => (
          <option
            key={option._id || index}
            value={option[field] || option}
            id={option._id || index}
          >
            {option[field] || option}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
      {/* || (
        <div className="hidden">fix</div>
      )} */}
    </div>
  );
};

Select.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired
  // value: PropTypes.string.isRequired // string or number..
};

export default Select;
