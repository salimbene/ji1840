import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const UIHeader = ({ user, consortia }) => {
  if (!user) return null;
  return (
    <header
      className="bx--header"
      role="banner"
      aria-label="IBM Platform Name"
      data-header
    >
      <a className="bx--skip-to-content" href="#main-content" tabIndex="0">
        Skip to main content
      </a>
      <button
        className="bx--header__menu-trigger bx--header__action"
        aria-label="Open menu"
        title="Open menu"
        data-navigation-menu-panel-label-expand="Open menu"
        data-navigation-menu-panel-label-collapse="Close menu"
        data-navigation-menu-target="#navigation-menu-f81vmxcka8e"
      >
        <svg
          focusable="false"
          preserveAspectRatio="xMidYMid meet"
          style={{ willChange: 'transform' }}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="bx--navigation-menu-panel-collapse-icon"
          width="20"
          height="20"
          viewBox="0 0 32 32"
        >
          <path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4l6.6 6.6L8 22.6 9.4 24l6.6-6.6 6.6 6.6 1.4-1.4-6.6-6.6L24 9.4z" />
        </svg>
        <svg
          focusable="false"
          preserveAspectRatio="xMidYMid meet"
          style={{ willChange: 'transform' }}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="bx--navigation-menu-panel-expand-icon"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <path d="M2 14.8h16V16H2zm0-3.6h16v1.2H2zm0-3.6h16v1.2H2zM2 4h16v1.2H2z" />
        </svg>
      </button>

      <a class="bx--header__name" href="/" title="">
        <span class="bx--header__name--prefix">
          Consortia<sup>(tm)</sup>
        </span>
      </a>
      <nav
        className="bx--header__nav"
        aria-label="Platform Name"
        data-header-nav
      >
        <ul
          className="bx--header__menu-bar"
          role="menubar"
          aria-label="Platform Name"
        >
          <li>
            <a
              className="bx--header__menu-item"
              href="/"
              role="menuitem"
              tabIndex="0"
            >
              {consortia.name}
            </a>
          </li>
        </ul>
      </nav>
      <div className="bx--header__global">
        <nav
          className="bx--header__nav"
          aria-label="Platform Name"
          data-header-nav
        >
          <ul
            className="bx--header__menu-bar"
            role="menubar"
            aria-label="Platform Name"
          >
            <li>
              <a
                className="bx--header__menu-item"
                href={`/users/${user._id}`}
                role="menuitem"
                tabIndex="0"
              >
                {`${user.mail} `}
                <i className="fa fa-user-circle" />
              </a>
            </li>
            <li>
              <a
                className="bx--header__menu-item"
                href={`/logout`}
                role="menuitem"
                tabIndex="0"
              >
                <i className="fa fa-sign-out" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default UIHeader;
