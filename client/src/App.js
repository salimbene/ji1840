import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import './App.css';
import Home from './components/Home';
import RegisterForm from './components/RegisterForm';
import UnitsForm from './components/UnitsForm';
import Units from './components/Units';
import LoginForm from './components/LoginForm';
import NotFound from './components/NotFound';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/register" component={RegisterForm} />
          <Route path="/login" component={LoginForm} />
          <Route path="/units/:id" component={UnitsForm} />
          <Route path="/units" component={Units} />
          <Route path="/not-found" component={NotFound} />
          <Route exact path="/" component={Home} />
          <Redirect to="/not-found" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
