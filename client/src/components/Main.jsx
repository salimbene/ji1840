import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Units from './Units';
import NotFound from './NotFound';
import Dummy from './Dummy';
import UnitsForm from './UnitsForm';
import LoginForm from './LoginForm';

class Main extends Component {
  state = {};
  render() {
    return (
      <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
        <Switch>
          <Route path="/login" component={LoginForm} />
          <Route path="/units/:id" component={UnitsForm} />
          <Route path="/units" component={Units} />
          <Route path="/dummy" component={Dummy} />
          <Route path="/not-found" component={NotFound} />
          <Route exact path="/" component={Home} />
          <Redirect to="/not-found" />
        </Switch>
      </main>
    );
  }
}

export default Main;
