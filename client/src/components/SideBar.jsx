import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

class SideBar extends Component {
  state = {};
  render() {
    return (
      <nav className="col-md-2 d-none d-md-block bg-light sidebar">
        <div className="sidebar-sticky">
          <ul className="nav flex-column">
            <li>
              <NavLink className="nav-link nav-item" to="/units">
                Unidades
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link nav-item" to="/dummy">
                Dummy
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link nav-item" to="/login">
                Login
              </NavLink>
            </li>
          </ul>

          <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span>Saved reports</span>
            <NavLink
              className="d-flex align-items-center text-muted"
              to="/units"
            />
          </h6>
          <ul className="nav flex-column mb-2">
            <li>
              <NavLink className="nav-link nav-item" to="/units">
                Current month
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link nav-item" to="/dummy">
                Last quarter
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default SideBar;
