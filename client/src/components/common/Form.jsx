import React, { Component } from 'react';
import Joi from 'joi-browser';
import Input from './Input';
import Select from './Select';
import TextArea from './TextArea';
import Check from './Check';

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
    const keys = { ...this.state.keys };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    if (input.options) {
      const { id } = input.options[input.options.selectedIndex];
      keys[`${input.name}Key`] = id;
    }

    this.setState({ data, errors, keys });
  };

  handleCheck = e => {
    const data = { ...this.state.data };
    data[e.target.name] = e.target.checked;
    this.setState({ data });
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
  renderTextArea(name, label, type = 'text', readonly = false) {
    const { data, errors } = this.state;
    return (
      <TextArea
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

  renderCheck(name, label) {
    const { data } = this.state;
    return (
      <Check
        name={name}
        label={label}
        onChange={this.handleCheck}
        checked={data[name]}
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
