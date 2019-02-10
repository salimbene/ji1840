import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const NavBar = ({ user }) => {
  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <Link className="navbar-brand col-sm-3 col-md-2 mr-0" to="/">
        Consortia
      </Link>
      {user && (
        <React.Fragment>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap">
              <NavLink className="nav-link" to="/">
                {user.mail}
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap">
              <NavLink className="nav-item" to="/logout">
                Salir
              </NavLink>
            </li>
          </ul>
        </React.Fragment>
      )}
    </nav>
  );
};

export default NavBar;
