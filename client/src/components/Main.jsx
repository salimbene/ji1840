import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import NavBar from './NavBar';
import SideBar from './SideBar';
import Home from './Home';
import Units from './Units';
import NotFound from './NotFound';
import Dummy from './Dummy';
import UnitsForm from './UnitsForm';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

class Main extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <div className="container-fluid">
          <div className="row">
            <SideBar />
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
              <Switch>
                <Route path="/register" component={RegisterForm} />
                <Route path="/login" component={LoginForm} />
                <Route path="/units/:id" component={UnitsForm} />
                <Route path="/units" component={Units} />
                <Route path="/dummy" component={Dummy} />
                <Route path="/not-found" component={NotFound} />
                <Route exact path="/" component={Home} />
                <Redirect to="/not-found" />
              </Switch>
            </main>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Main;
