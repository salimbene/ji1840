import React, { Fragment } from 'react';

const CarbonHeader = () => {
  return (
    <Fragment>
      <header
        className="bx--header"
        role="banner"
        aria-label="IBM Platform Name"
        data-header
      >
        <a className="bx--skip-to-content" href="#main-content" tabindex="0">
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
            // style="will-change: transform;"
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
            // style="will-change: transform;"
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
        <a className="bx--header__name" href="javascript:void(0)" title="">
          <span className="bx--header__name--prefix">IBM &nbsp;</span>
          [Platform]
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
                href="javascript:void(0)"
                role="menuitem"
                tabindex="0"
              >
                L1 link 1
              </a>
            </li>
            <li>
              <a
                className="bx--header__menu-item"
                href="javascript:void(0)"
                role="menuitem"
                tabindex="0"
              >
                L1 link 2
              </a>
            </li>
            <li className="bx--header__submenu" data-header-submenu>
              <a
                className="bx--header__menu-item bx--header__menu-title"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded="true"
                href="javascript:void(0)"
                tabindex="0"
              >
                L1 link 3
                <svg
                  className="bx--header__menu-arrow"
                  width="12"
                  height="7"
                  aria-hidden="true"
                >
                  <path d="M6.002 5.55L11.27 0l.726.685L6.003 7 0 .685.726 0z" />
                </svg>
              </a>
              <ul
                className="bx--header__menu"
                role="menu"
                aria-label="L1 link 3"
              >
                <li role="none">
                  <a
                    className="bx--header__menu-item"
                    role="menuitem"
                    href="javascript:void(0)"
                    tabindex="-1"
                  >
                    <span className="bx--text-truncate--end">Link 1</span>
                  </a>
                </li>
                <li role="none">
                  <a
                    className="bx--header__menu-item"
                    role="menuitem"
                    href="javascript:void(0)"
                    tabindex="-1"
                  >
                    <span className="bx--text-truncate--end">Link 2</span>
                  </a>
                </li>
                <li role="none">
                  <a
                    className="bx--header__menu-item"
                    role="menuitem"
                    href="javascript:void(0)"
                    tabindex="-1"
                  >
                    <span className="bx--text-truncate--end">
                      Ipsum architecto voluptatem
                    </span>
                  </a>
                </li>
              </ul>
            </li>
            <li className="bx--header__submenu" data-header-submenu>
              <a
                className="bx--header__menu-item bx--header__menu-title"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded="false"
                href="javascript:void(0)"
                tabindex="0"
              >
                L1 link 4
                <svg
                  className="bx--header__menu-arrow"
                  width="12"
                  height="7"
                  aria-hidden="true"
                >
                  <path d="M6.002 5.55L11.27 0l.726.685L6.003 7 0 .685.726 0z" />
                </svg>
              </a>
              <ul
                className="bx--header__menu"
                role="menu"
                aria-label="L1 link 4"
              >
                <li role="none">
                  <a
                    className="bx--header__menu-item"
                    role="menuitem"
                    href="javascript:void(0)"
                    tabindex="-1"
                  >
                    <span className="bx--text-truncate--end">Link 1</span>
                  </a>
                </li>
                <li role="none">
                  <a
                    className="bx--header__menu-item"
                    role="menuitem"
                    href="javascript:void(0)"
                    tabindex="-1"
                  >
                    <span className="bx--text-truncate--end">Link 2</span>
                  </a>
                </li>
                <li role="none">
                  <a
                    className="bx--header__menu-item"
                    role="menuitem"
                    href="javascript:void(0)"
                    tabindex="-1"
                  >
                    <span className="bx--text-truncate--end">
                      Ipsum architecto voluptatem
                    </span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <div className="bx--header__global">
          <button
            className="bx--header__menu-trigger bx--header__action"
            aria-label="Action 1"
            title="Action 1"
            data-navigation-menu-panel-label-expand="Action 1"
            data-navigation-menu-panel-label-collapse="Close menu"
            data-product-switcher-target="#switcher-48o0vjxf659"
          >
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              // style="will-change: transform;"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="bx--navigation-menu-panel-expand-icon"
              width="20"
              height="20"
              viewBox="0 0 32 32"
            >
              <path d="M8.24 25.14L7 26.67a13.79 13.79 0 0 0 4.18 2.44l.69-1.87a12 12 0 0 1-3.63-2.1zM4.19 18l-2 .41A14.09 14.09 0 0 0 3.86 23l1.73-1a12.44 12.44 0 0 1-1.4-4zm7.63-13.24l-.69-1.87A13.79 13.79 0 0 0 7 5.33l1.24 1.53a12 12 0 0 1 3.58-2.1zM5.59 10L3.86 9a14.37 14.37 0 0 0-1.64 4.59l2 .34A12.05 12.05 0 0 1 5.59 10zM16 2v2a12 12 0 0 1 0 24v2a14 14 0 0 0 0-28z" />
            </svg>
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              // style="will-change: transform;"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="bx--navigation-menu-panel-collapse-icon"
              width="20"
              height="20"
              viewBox="0 0 32 32"
            >
              <path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4l6.6 6.6L8 22.6 9.4 24l6.6-6.6 6.6 6.6 1.4-1.4-6.6-6.6L24 9.4z" />
            </svg>
          </button>
          <button
            className="bx--header__menu-trigger bx--header__action"
            aria-label="Action 2"
            title="Action 2"
            data-navigation-menu-panel-label-expand="Action 2"
            data-navigation-menu-panel-label-collapse="Close menu"
            data-product-switcher-target="#switcher-48o0vjxf659"
          >
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              // style="will-change: transform;"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="bx--navigation-menu-panel-expand-icon"
              width="20"
              height="20"
              viewBox="0 0 32 32"
            >
              <path d="M8.24 25.14L7 26.67a13.79 13.79 0 0 0 4.18 2.44l.69-1.87a12 12 0 0 1-3.63-2.1zM4.19 18l-2 .41A14.09 14.09 0 0 0 3.86 23l1.73-1a12.44 12.44 0 0 1-1.4-4zm7.63-13.24l-.69-1.87A13.79 13.79 0 0 0 7 5.33l1.24 1.53a12 12 0 0 1 3.58-2.1zM5.59 10L3.86 9a14.37 14.37 0 0 0-1.64 4.59l2 .34A12.05 12.05 0 0 1 5.59 10zM16 2v2a12 12 0 0 1 0 24v2a14 14 0 0 0 0-28z" />
            </svg>
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              // style="will-change: transform;"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="bx--navigation-menu-panel-collapse-icon"
              width="20"
              height="20"
              viewBox="0 0 32 32"
            >
              <path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4l6.6 6.6L8 22.6 9.4 24l6.6-6.6 6.6 6.6 1.4-1.4-6.6-6.6L24 9.4z" />
            </svg>
          </button>
          <button
            className="bx--header__menu-trigger bx--header__action"
            aria-label="Action 3"
            title="Action 3"
            data-navigation-menu-panel-label-expand="Action 3"
            data-navigation-menu-panel-label-collapse="Close menu"
            data-product-switcher-target="#switcher-48o0vjxf659"
          >
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              // style="will-change: transform;"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="bx--navigation-menu-panel-expand-icon"
              width="20"
              height="20"
              viewBox="0 0 32 32"
            >
              <path d="M8.24 25.14L7 26.67a13.79 13.79 0 0 0 4.18 2.44l.69-1.87a12 12 0 0 1-3.63-2.1zM4.19 18l-2 .41A14.09 14.09 0 0 0 3.86 23l1.73-1a12.44 12.44 0 0 1-1.4-4zm7.63-13.24l-.69-1.87A13.79 13.79 0 0 0 7 5.33l1.24 1.53a12 12 0 0 1 3.58-2.1zM5.59 10L3.86 9a14.37 14.37 0 0 0-1.64 4.59l2 .34A12.05 12.05 0 0 1 5.59 10zM16 2v2a12 12 0 0 1 0 24v2a14 14 0 0 0 0-28z" />
            </svg>
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              // style="will-change: transform;"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="bx--navigation-menu-panel-collapse-icon"
              width="20"
              height="20"
              viewBox="0 0 32 32"
            >
              <path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4l6.6 6.6L8 22.6 9.4 24l6.6-6.6 6.6 6.6 1.4-1.4-6.6-6.6L24 9.4z" />
            </svg>
          </button>
          <button
            className="bx--header__menu-trigger bx--header__action"
            aria-label="Action 4"
            title="Action 4"
            data-navigation-menu-panel-label-expand="Action 4"
            data-navigation-menu-panel-label-collapse="Close menu"
            data-product-switcher-target="#switcher-48o0vjxf659"
          >
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              // style="will-change: transform;"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="bx--navigation-menu-panel-expand-icon"
              width="20"
              height="20"
              viewBox="0 0 32 32"
            >
              <path d="M8.24 25.14L7 26.67a13.79 13.79 0 0 0 4.18 2.44l.69-1.87a12 12 0 0 1-3.63-2.1zM4.19 18l-2 .41A14.09 14.09 0 0 0 3.86 23l1.73-1a12.44 12.44 0 0 1-1.4-4zm7.63-13.24l-.69-1.87A13.79 13.79 0 0 0 7 5.33l1.24 1.53a12 12 0 0 1 3.58-2.1zM5.59 10L3.86 9a14.37 14.37 0 0 0-1.64 4.59l2 .34A12.05 12.05 0 0 1 5.59 10zM16 2v2a12 12 0 0 1 0 24v2a14 14 0 0 0 0-28z" />
            </svg>
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              // style="will-change: transform;"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="bx--navigation-menu-panel-collapse-icon"
              width="20"
              height="20"
              viewBox="0 0 32 32"
            >
              <path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4l6.6 6.6L8 22.6 9.4 24l6.6-6.6 6.6 6.6 1.4-1.4-6.6-6.6L24 9.4z" />
            </svg>
          </button>
        </div>
      </header>
    </Fragment>
  );
};

export default CarbonHeader;
