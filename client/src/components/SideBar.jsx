import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SideBar extends Component {
  state = {};
  render() {
    return (
      <nav className="col-md-2 d-none d-md-block bg-light sidebar">
        <div className="sidebar-sticky">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/units">
                Unidades
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dummy">
                Dummy
              </Link>
            </li>
          </ul>

          <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span>Saved reports</span>
            <Link className="d-flex align-items-center text-muted" to="/" />
          </h6>
          <ul className="nav flex-column mb-2">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Current month
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Last quarter
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default SideBar;
