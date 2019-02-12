import React from 'react';
import { Redirect } from 'react-router-dom';
import Form from './common/Form';
import auth from '../services/authService';
import Joi from 'joi-browser';

class ExpensesForm extends Form {
  state = {
    data: {
      category: '',
      concept: '',
      type: '',
      ammount: 0,
      user: {},
      period: 0
    },
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    category: Joi.string()
      .required()
      .label('Rubro'),
    concept: Joi.string()
      .required()
      .label('Detalle'),
    type: Joi.string().label('Tipo'),
    ammount: Joi.number().label('Importe'),
    period: Joi.date().label('Periodo')
  };

  doSubmit = async () => {
    const { username, password } = this.state.data;
    try {
      await auth.login(username, password);
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : '/';
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
      <React.Fragment>
        <div className="border border-info rounded shadow-sm p-3 mb-5 bg-white">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col">
                {this.renderInput('category', 'Categoría')}
              </div>
              <div className="col">
                {this.renderInput('concept', 'Concepto')}
              </div>
              <div className="col">{this.renderInput('type', 'Tipo')}</div>
              <div className="col">
                {this.renderInput('ammount', 'Importe')}
              </div>
              <div className="col">{this.renderInput('period', 'Período')}</div>
              <div className="col">{this.renderButton('Acceder')}</div>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default ExpensesForm;
