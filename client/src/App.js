import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import UnitsForm from './components/UnitsForm';
import Units from './components/Units';
import Users from './components/Users';
import UsersForm from './components/UsersForm';
import CurrentMonth from './components/CurrentMonth';
import Periods from './components/Periods';
import PeriodsForm from './components/PeriodsForm';
import Expenses from './components/Expenses';
import ExpensesForm from './components/ExpensesForm';
import Payments from './components/Payments';
import Suppliers from './components/Suppliers';
import SuppliersForm from './components/SuppliersForm';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Logout from './components/Logout';
import NotFound from './components/NotFound';
import ModelsForm from './components/ModelsForm';
import Models from './components/Models';
import Consortia from './components/Consortia';
import ProtectedRoute from './components/common/ProtectedRoute';
import auth from './services/authService';
import SideBar from './components/SideBar';
import NavBar from './components/NavBar';
import { getConsortia } from './services/consortiaService';

class App extends Component {
  state = {};
  async componentDidMount() {
    const user = auth.getCurrentUser();
    const { data } = await getConsortia();
    const consortia = data[0];
    this.setState({ user, consortia });
  }
  render() {
    const { user, consortia } = this.state;

    return (
      <Fragment>
        <ToastContainer />
        <NavBar user={user} consortia={consortia} />
        <div className="container-fluid">
          <div className="row">
            <SideBar user={user} />
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
              <Switch>
                <Route path="/login" component={LoginForm} />
                <Route path="/logout" component={Logout} />
                <ProtectedRoute path="/register" component={RegisterForm} />
                <ProtectedRoute
                  path="/suppliers/:id"
                  component={SuppliersForm}
                />
                <ProtectedRoute path="/suppliers" component={Suppliers} />
                <ProtectedRoute
                  path="/periods/:id/:period"
                  component={PeriodsForm}
                />
                <ProtectedRoute path="/periods/:id/" component={PeriodsForm} />
                <ProtectedRoute path="/periods" component={Periods} />
                <ProtectedRoute path="/models/:id" component={ModelsForm} />
                <ProtectedRoute path="/models" component={Models} />
                <ProtectedRoute path="/current" component={CurrentMonth} />
                <ProtectedRoute path="/periods" component={Periods} />
                <ProtectedRoute path="/payments" component={Payments} />
                <ProtectedRoute path="/expenses/:id" component={ExpensesForm} />
                <ProtectedRoute path="/expenses" component={Expenses} />
                <ProtectedRoute path="/units/:id" component={UnitsForm} />
                <ProtectedRoute path="/units" component={Units} />} />
                <ProtectedRoute path="/consortia" component={Consortia} />} />
                <ProtectedRoute path="/users/:id" component={UsersForm} />} />
                <ProtectedRoute path="/users" component={Users} />} />
                <Route path="/not-found" component={NotFound} />
                <ProtectedRoute exact path="/" component={Home} />
                <Redirect to="/login" />
              </Switch>
            </main>
          </div>
        </div>
      </Fragment>
    );
  }
}

//Render props of Router tag is used if additionals props are
//required by the cuild component.

export default App;
