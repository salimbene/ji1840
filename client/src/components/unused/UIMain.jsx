import React, { Component, Fragment } from 'react';
import UIMenu from './UIMenu';
import UIBody from './UIBody';
import UIHeader from './UIHeader';

class UIMain extends Component {
  state = {};
  render() {
    return (
      <div className="cc--ui-wrapper">
        <UIHeader />
        <UIMenu />
        <div className="cc--ui-main">
          <UIBody />
        </div>
      </div>
    );
  }
}

export default UIMain;
