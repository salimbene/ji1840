import React, { Component } from 'react';
import Joi from 'joi-browser';
import Input from './Input';
import Select from './Select';

class Form extends Component {
  state = {
    data: {},
    errors: {}
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);

    if (!error) return null;
    const errors = {};

    for (let item of error.details) errors[item.path[0]] = item.message;
    console.log('validate()=', errors);
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    let selectUserId = null;
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    if (input.options)
      selectUserId = input.options[input.options.selectedIndex] || null;
    data[input.name] = input.value;

    this.setState({ data, errors, selectUserId });
  };

  handleChangeSelect = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    const { id: selectedId } = input.options[input.options.selectedIndex];
    data[input.name] = input.value;

    this.setState({ data, errors, selectUserId });
  };

  renderButton(label) {
    return (
      <button
        disabled={this.validate()}
        className="btn btn-primary btn-center mx-auto"
      >
        {label}
      </button>
    );
  }

  renderInput(name, label, type = 'text', readonly = false) {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        error={errors[name]}
        readOnly={readonly}
      />
    );
  }

  renderSelect(name, label, field, options) {
    const { data, errors } = this.state;
    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        field={field}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderOptions(name, options, label) {
    return (
      <div classNAme="form-group">
        <label for={name}>{label}</label>
        <select class="form-control" id={name}>
          {options.map(option => (
            <option>{option}</option>
          ))}
        </select>
      </div>
    );
  }
}

export default Form;
