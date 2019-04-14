import React from 'react';
const UISideItem = ({ label, to }) => {
  return (
    <li className="bx--side-nav__item">
      <a className="bx--side-nav__link" href={to}>
        <span className="bx--side-nav__link-text">{label}</span>
      </a>
    </li>
  );
};

export default UISideItem;
