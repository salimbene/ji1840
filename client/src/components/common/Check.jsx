import React from 'react';

const Check = ({ name, label, error, onChange, checked, ...rest }) => {
  return (
    <div className="form-check form-check-inline">
      <label className="form-check-label mr-2" htmlFor={name}>
        {label}
      </label>
      <input
        type="checkbox"
        className="form-check-input"
        id={name}
        name={name}
        onChange={onChange}
        checked={checked}
      />
    </div>
  );
};

export default Check;
