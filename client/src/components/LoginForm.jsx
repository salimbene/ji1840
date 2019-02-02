import React, { Component } from 'react';
import Joi from 'joi-browser';
import Input from './common/Input';
class LoginForm extends Component {
  state = {
    account: { username: '', password: '' },
    errors: {}
  };

  schema = {
    username: Joi.string().required(),
    password: Joi.string()
      .min(3)
      .max(8)
      .required()
  };

  validate = () => {
    const result = Joi.validate(this.state.account, this.schema, {
      abortEarly: false
    });

    console.log(result);
    const errors = {};
    const { account } = this.state;

    if (account.username.trim() === '') errors.username = 'username required';

    if (account.password.trim() === '') errors.password = 'password required';

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    console.log('Submited');
    //Call srv, save and redirect
  };

  validateProperty = ({ name, value }) => {
    if (name === 'username') {
      if (value.trim() === '') return 'Username is required';
    }
    if (name === 'password') {
      if (value.trim() === '') return 'Password is required';
    }
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const account = { ...this.state.account };
    account[input.name] = input.value;

    this.setState({ account, errors });
  };

  render() {
    const { account, errors } = this.state;
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <Input
            name="username"
            value={account.username}
            label="username"
            onChange={this.handleChange}
            error={errors.username}
          />
          <Input
            name="password"
            value={account.password}
            label="password"
            onChange={this.handleChange}
            error={errors.password}
          />
          <button className="btn btn-primary">Acceder</button>
        </form>
      </div>
    );
  }
}

export default LoginForm;
