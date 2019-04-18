import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import Form from './common/Form';
import auth from '../services/authService';
import Joi from 'joi-browser';

class LoginForm extends Form {
  state = {
    data: { username: '', password: '' },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email()
      .label('Usuario'),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
      .label('Clave')
  };

  doSubmit = async () => {
    const { username, password } = this.state.data;
    await auth.login(username, password);
    const { state } = this.props.location;
    window.location = state ? state.from.pathname : '/';
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;

    return (
      <Fragment>
        <div className="rounded centered login">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput('username', 'Usuario')}
            {this.renderInput('password', 'Clave', 'password')}
            {this.renderButton('Acceder')}
          </form>
        </div>
      </Fragment>
    );
  }
}

export default LoginForm;
