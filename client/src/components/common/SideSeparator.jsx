import React from 'react';

const SideSeparator = ({ label }) => {
  return (
    <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
      <span>{label}</span>
    </h6>
  );
};

export default SideSeparator;
