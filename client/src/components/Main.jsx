import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Units from './Units';
class Main extends Component {
  state = {};
  render() {
    return (
      <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
        <Switch>
          <Route path="/units" component={Units} />
          <Route path="/" component={Home} />
        </Switch>
      </main>
    );
  }
}

export default Main;
