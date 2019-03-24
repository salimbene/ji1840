import React from 'react';

const SearchBox = ({ value, onChange, className }) => {
  return (
    <div className="input-group input-group-sm m-1">
      <input
        id="searchx"
        type="text"
        name="query"
        className={`form-control ${className}`}
        placeholder="Buscar..."
        value={value}
        onChange={e => onChange(e.currentTarget.value)}
      />
    </div>
  );
};

export default SearchBox;
