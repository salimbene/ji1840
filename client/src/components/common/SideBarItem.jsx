import React from 'react';
import { NavLink } from 'react-router-dom';
const SideBarItem = ({ label, to }) => {
  return (
    <li>
      <NavLink className="nav-link nav-item" to={to}>
        {label}
      </NavLink>
    </li>
  );
};

export default SideBarItem;
