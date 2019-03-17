import React, { Component } from 'react';
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
import PaymentsForm from './components/PaymentsForm';
import Suppliers from './components/Suppliers';
import SuppliersForm from './components/SuppliersForm';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Logout from './components/Logout';
import NotFound from './components/NotFound';
import SideBar from './components/SideBar';
import NavBar from './components/NavBar';
import ModelsForm from './components/ModelsForm';
import Models from './components/Models';
import ProtectedRoute from './components/common/ProtectedRoute';
import auth from './services/authService';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

class App extends Component {
  state = {};
  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }
  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <NavBar user={user} />
        <ToastContainer />
        <div className="container-fluid">
          <div className="row">
            <SideBar user={user} />
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
              <Switch>
                <Route path="/register" component={RegisterForm} />
                <Route path="/login" component={LoginForm} />
                <Route path="/logout" component={Logout} />
                <ProtectedRoute
                  path="/suppliers/:id"
                  component={SuppliersForm}
                />
                <ProtectedRoute path="/suppliers" component={Suppliers} />
                <ProtectedRoute path="/periods/:id" component={PeriodsForm} />
                <ProtectedRoute path="/periods" component={Periods} />
                <ProtectedRoute path="/models/:id" component={ModelsForm} />
                <ProtectedRoute path="/models" component={Models} />
                <ProtectedRoute path="/current" component={CurrentMonth} />
                <ProtectedRoute path="/periods" component={Periods} />
                <ProtectedRoute path="/payments/:id" component={PaymentsForm} />
                <ProtectedRoute path="/payments" component={Payments} />
                <ProtectedRoute path="/expenses/:id" component={ExpensesForm} />
                <ProtectedRoute path="/expenses" component={Expenses} />
                <ProtectedRoute path="/units/:id" component={UnitsForm} />
                <ProtectedRoute path="/units" component={Units} />} />
                <ProtectedRoute path="/users/:id" component={UsersForm} />} />
                <ProtectedRoute path="/users" component={Users} />} />
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

//Render props of Router tag is used if additionals props are
//required by the cuild component.

export default App;
