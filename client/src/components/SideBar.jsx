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
            <h5>
              <small className="text-muted">
                Usuario
                <br />
              </small>
              {user.name}
            </h5>
            <SideSeparator label="Movimientos" />
            <ul className="nav flex-column mb-2">
              <SideBarItem label="Registrar Gastos" to="/expenses" />
              <SideBarItem label="Registrar Pagos" to="/payments" />
            </ul>
            <SideSeparator label="Administración" />
            <ul className="nav flex-column mb-2">
              <SideBarItem label="Unidades" to="/units" />
              <SideBarItem label="Usuarios" to="/users" />
              <SideBarItem label="Proveedores" to="/suppliers" />
            </ul>
          </React.Fragment>
        )}
      </div>
    </nav>
  );
};

export default SideBar;
