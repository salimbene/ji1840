import React from 'react';

const SearchBox = ({ value, onChange }) => {
  return (
    <div>
      <input
        id="searchx"
        type="text"
        name="query"
        className="bx--text-input"
        placeholder="Buscar..."
        value={value}
        onChange={e => onChange(e.currentTarget.value)}
      />
    </div>
  );
};

export default SearchBox;
