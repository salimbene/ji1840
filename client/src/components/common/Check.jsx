import React from 'react';

const Check = ({ name, label, onChange, checked, ...rest }) => {
  // console.log('checked', label, checked);
  return (
    <div className="bx--form-item bx--checkbox-wrapper">
      <input
        id={name}
        className="bx--checkbox"
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <label className="bx--checkbox-label" htmlFor={name}>
        {label}
      </label>
    </div>
  );
};

export default Check;
