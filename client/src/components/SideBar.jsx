import React from 'react';
import SideBarItem from './common/SideBarItem';
import SideSeparator from './common/SideSeparator';

const SideBar = ({ user }) => {
  console.log('SideBar:', user);
  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        {!user && (
          <React.Fragment>
            <ul className="nav flex-column">
              <SideBarItem label="Acceder" to="/login" />
            </ul>
          </React.Fragment>
        )}

        {user && (
          <React.Fragment>
            <SideSeparator label="Información" />
            <ul className="nav flex-column mb-2">
              <SideBarItem label="Usuarios" to="/users" />
              <SideBarItem label="Proveedores" to="/suppliers" />
              <SideBarItem label="Unidades" to="/units" />
            </ul>
          </React.Fragment>
        )}
        {user && user.isCouncil && (
          <React.Fragment>
            <SideSeparator label="Gestión" />
            <ul className="nav flex-column mb-2">
              <SideBarItem label="Expensas" to="/periods" />
              <SideBarItem label="Gastos" to="/expenses" />
              <SideBarItem label="Pagos" to="/payments" />
            </ul>
            <SideSeparator label="Configuración" />
            <ul className="nav flex-column mb-2">
              <SideBarItem label="Esquemas" to="/models" />
              <SideBarItem label="Configuración" to="/consortia" />
            </ul>
          </React.Fragment>
        )}
      </div>
    </nav>
  );
};

export default SideBar;
