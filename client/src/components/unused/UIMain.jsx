import React, { Component, Fragment } from 'react';
import UIHeader from './UIHeader';
import UISide from './UISide';

class UIMain extends Component {
  state = {};
  render() {
    return (
      <Fragment>
        <UIHeader />
        <UISide />
        <div className="bx--content" />{' '}
      </Fragment>
    );
  }
}

export default UIMain;
