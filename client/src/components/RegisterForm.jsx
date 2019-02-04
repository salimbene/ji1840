import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';

class RegisterForm extends Form {
  state = {
    data: {},
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .label('Usuario'),
    password: Joi.string()
      .min(3)
      .max(8)
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
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('username', 'Username')}
          {this.renderInput('password', 'Password', 'password')}
          {this.renderInput('name', 'Name')}
          {this.renderButton('Acceder')}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
