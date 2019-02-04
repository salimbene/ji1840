import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Main from './components/Main';
import './App.css';
import LoginForm from './components/LoginForm';
import PrivateRoute from './components/common/PrivateRoute';
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <PrivateRoute exact path="/main" component={Main} />
          <Route exact path="/" component={LoginForm} />
          <Redirect to="/not-found" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
