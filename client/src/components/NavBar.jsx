import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const NavBar = ({ user }) => {
  return (
    <nav className="navbar nabvar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        Consortia
      </Link>
      <div className="collpase navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          {!user && (
            <React.Fragment>
              <NavLink className="nav-item nav-link" to="/units">
                Unidades
              </NavLink>
              <NavLink className="nav-item nav-link" to="/login">
                Login
              </NavLink>
              <NavLink className="nav-item nav-link" to="/register">
                Register
              </NavLink>
            </React.Fragment>
          )}
          {user && (
            <React.Fragment>
              <NavLink className="nav-item nav-link" to="/profile">
                {user.name}
              </NavLink>
              <NavLink className="nav-item nav-link" to="/logout">
                Log out
              </NavLink>
            </React.Fragment>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
