import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import { register } from '../services/usersService';
import auth from '../services/authService';

class RegisterForm extends Form {
  state = {
    data: { mail: '', password: '', firstname: '', lastname: '' },
    errors: {}
  };

  schema = {
    lastname: Joi.string()
      .max(255)
      .label('Apellido'),
    firstname: Joi.string()
      .max(255)
      .label('Nombre'),
    mail: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email()
      .label('Mail'),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
      .label('Clave')
  };

  doSubmit = async () => {
    try {
      const response = await register(this.state.data);
      auth.loginWithJwt(response.headers['x-auth-token']);
      window.location = '/';
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };
  render() {
    return (
      <div className="rounded centered registrar">
        <div className="row">
          <h3 className="mx-auto">
            <i className="fa fa-user-plus mr-3 mb-2" />
            Registrar Usuario
          </h3>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col">
              {this.renderInput('lastname', 'Apellido')}
            </div>
          </div>
          <div className="row">
            <div className="col">{this.renderInput('firstname', 'Nombre')}</div>
          </div>
          <div className="row">
            <div className="col">{this.renderInput('mail', 'Mail')}</div>
          </div>
          <div className="row">
            <div className="col">
              {this.renderInput('password', 'Clave', 'password')}
            </div>
          </div>
          <div className="row">
            <div className="mx-auto">{this.renderButton('Acceder')}</div>
          </div>
        </form>
      </div>
    );
  }
}

export default RegisterForm;
