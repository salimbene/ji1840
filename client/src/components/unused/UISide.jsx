import React from 'react';
import UISideItem from './UISideItem';
const UISide = ({ user }) => {
  return (
    <aside className="bx--side-nav bx--side-nav--fixed" data-side-nav>
      <nav
        className="bx--side-nav__navigation"
        role="navigation"
        aria-label="Side navigation"
      >
        <ul className="bx--side-nav__items">
          <UISideItem label="Usuarios" to="/users" />
          <UISideItem label="Proveedores" to="/suppliers" />
          <UISideItem label="Unidades" to="/units" />
        </ul>
      </nav>
    </aside>
  );
};

export default UISide;
