import React from 'react';
import SideBarItem from './common/SideBarItem';
import SideSeparator from './common/SideSeparator';

const SideBar = ({ user }) => {
  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        {!user && (
          <React.Fragment>
            <ul className="nav flex-column">
              <SideBarItem label="Acceder" to="/login" />
              <SideBarItem label="Registro" to="/register" />
            </ul>
          </React.Fragment>
        )}

        {user && user.isAdmin && (
          <React.Fragment>
            <span>{user.mail}</span>
            <SideSeparator label="Movimientos" />
            <ul className="nav flex-column mb-2">
              <SideBarItem label="Registrar Gastos" to="/expenses" />
            </ul>
            <SideSeparator label="Administración" />
            <ul className="nav flex-column mb-2">
              <SideBarItem label="Unidades" to="/units" />
              <SideBarItem label="Usuarios" to="/users" />
            </ul>
          </React.Fragment>
        )}
      </div>
    </nav>
  );
};

export default SideBar;
