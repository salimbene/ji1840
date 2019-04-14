import React, { Fragment } from 'react';
import SideBarItem from './common/SideBarItem';
import SideSeparator from './common/SideSeparator';

const SideBar = ({ user }) => {
  console.log('SideBar:', user);
  return (
    <nav className="col-md-2 d-none d-md-block  sidebar">
      <div className="sidebar-sticky">
        {/* {!user && (
          <Fragment>
            <ul className="nav flex-column">
              <SideBarItem label="Acceder" to="/login" />
            </ul>
          </Fragment>
        )} */}

        {user && (
          <Fragment>
            <SideSeparator label="Información" />
            <ul className="nav flex-column mb-2">
              <SideBarItem label="Usuarios" to="/users" />
              <SideBarItem label="Proveedores" to="/suppliers" />
              <SideBarItem label="Expensas" to="/periods" />
            </ul>
          </Fragment>
        )}
        {user && user.isCouncil && (
          <Fragment>
            <SideSeparator label="Movimientos" />
            <ul className="nav flex-column mb-2">
              <SideBarItem label="Gastos" to="/expenses" />
              <SideBarItem label="Pagos" to="/payments" />
            </ul>
            <SideSeparator label="Configuración" />
            <ul className="nav flex-column mb-2">
              <SideBarItem label="Unidades" to="/units" />
              <SideBarItem label="Esquemas" to="/models" />
              <SideBarItem label="Configuración" to="/consortia" />
            </ul>
          </Fragment>
        )}
      </div>
    </nav>
  );
};

export default SideBar;
