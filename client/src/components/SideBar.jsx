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
              <SideBarItem label="Consorcio" to="/consortia" />
              <SideBarItem label="Proveedores" to="/suppliers" />
              <SideBarItem label="Usuarios" to="/users" />
            </ul>
          </Fragment>
        )}
        <Fragment>
          <SideSeparator label="Consorcio" />
          <ul className="nav flex-column mb-2">
            <SideBarItem label="Expensas" to="/periods" />
            {user && user.isCouncil && (
              <Fragment>
                <SideBarItem label="Gastos" to="/expenses" />
                <SideBarItem label="Pagos" to="/payments" />
                <SideBarItem label="Unidades" to="/units" />
              </Fragment>
            )}
          </ul>
        </Fragment>
        {user && user.isAdmin && (
          <Fragment>
            <SideSeparator label="Admin" />
            <ul className="nav flex-column mb-2">
              <SideBarItem label="Esquemas" to="/models" />
            </ul>
          </Fragment>
        )}
      </div>
    </nav>
  );
};

export default SideBar;
