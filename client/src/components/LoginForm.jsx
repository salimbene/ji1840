import React from 'react';
import Form from './common/Form';
import { login } from '../services/loginService';
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
    try {
      const result = await login({ mail: username, password });
      const token = result.headers['consortia-auth-token'];
      localStorage.setItem('consortia-auth-token', token);

      console.log(token);
    } catch (ex) {
      console.log(ex.response.data);
    }
  };

  render() {
    return (
      <React.Fragment>
        <img src="../ji1840.jpg" id="background" alt="" />
        <div className="rounded centered login">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput('username', 'Usuario')}
            {this.renderInput('password', 'Clave', 'password')}
            {this.renderButton('Acceder')}
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default LoginForm;
