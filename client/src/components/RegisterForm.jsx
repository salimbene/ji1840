import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';

class RegisterForm extends Form {
  state = {
    data: { username: '', password: '', name: '' },
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
      .label('Clave'),
    name: Joi.string()
      .required()
      .label('Name')
  };

  doSubmit = () => {
    console.log('Submited');
    //Call srv, save and redirect
  };
  render() {
    return (
      <div className="rounded centered registrar">
        <h1>Registrar Usuario</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('username', 'Usuario')}
          {this.renderInput('password', 'Clave', 'password')}
          {this.renderInput('name', 'Nombre')}
          {this.renderButton('Acceder')}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
