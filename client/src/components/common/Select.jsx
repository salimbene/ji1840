import React from 'react';

const Select = ({ value, label, items }) => {
  console.log(items, value);
  return (
    <React.Fragment>
      <label className="label" htmlFor="select">
        {label}
      </label>
      <select className="custom-select lg mb-3" name="select">
        {items.map(i => (
          <option key={i._id} value={i[value]}>
            {i[value]}
          </option>
        ))}
      </select>
    </React.Fragment>
  );
};

export default Select;
