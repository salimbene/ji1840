import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import { register } from '../services/usersService';

class RegisterForm extends Form {
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
    try {
      const response = await register(this.state.data);
      localStorage.setItem('token', response.headers['x-auth-token']);
      this.props.history.push('/');
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
    //Call srv, save and redirect
  };
  render() {
    return (
      <div className="rounded centered registrar">
        <h1>Registrar Usuario</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('username', 'Usuario')}
          {this.renderInput('password', 'Clave', 'password')}
          {this.renderButton('Acceder')}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
