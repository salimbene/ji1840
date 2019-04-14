import React from 'react';
import PropTypes from 'prop-types';

const fullName = ['tenant', 'landlord', 'lastname', 'userId', 'landlordId'];

const Select = ({ name, label, field, options, ...rest }) => {
  return (
    <div className="bx--form-item">
      <div className="bx--select">
        <label className="bx--label" htmlFor={name}>
          {label}
        </label>
        <div className="bx--select-input__wrapper">
          <select name={name} id={name} {...rest} className="bx--select-input">
            <option value="" />
            {options.map((option, index) => (
              <option
                key={option._id || index}
                value={option[field] || option}
                id={option._id || index}
                className="bx--select-option"
              >
                {(fullName.includes(name)
                  ? `${option['lastname']}, ${option['firstname']}`
                  : option[field]) || option}
              </option>
            ))}
          </select>
          <svg
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            style={{ willChange: 'transform' }}
            xmlns="http://www.w3.org/2000/svg"
            className="bx--select__arrow"
            width="10"
            height="6"
            viewBox="0 0 10 6"
            aria-hidden="true"
          >
            <path d="M5 6L0 1 .7.3 5 4.6 9.3.3l.7.7z" />
          </svg>
        </div>
      </div>
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
