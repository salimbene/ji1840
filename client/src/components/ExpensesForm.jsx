import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import { getExpense, saveExpense } from '../services/expensesService';
import { getLastXMonths, getPeriod } from '../utils/dates';
import auth from '../services/authService';

class ExpensesForm extends Form {
  state = {
    data: {
      category: '',
      concept: '',
      type: '',
      ammount: 0,
      period: getPeriod(new Date())
    },
    errors: {}
  };

  typeOptions = ['A', 'B'];

  categoryOptions = [
    'Mantenimiento',
    'Servicios',
    'Impuestos',
    'Honorarios',
    'Abonos',
    'Generales'
  ];

  schema = {
    _id: Joi.string(),
    category: Joi.string().label('Rubro'),
    concept: Joi.string()
      .required()
      .label('Concepto'),
    type: Joi.string()
      .valid('A', 'B')
      .required()
      .label('Tipo'),
    ammount: Joi.number()
      .required()
      .label('Importe'),
    period: Joi.string()
      .required()
      .label('Mes')
  };

  async populateExpenses() {
    try {
      const expenseId = this.props.match.params.id;
      if (expenseId === 'new') {
        // const data = { period: ) };
        // this.setState({ data });
        return;
      }
      const { data: expense } = await getExpense(expenseId);
      this.setState({ data: this.mapToViewModel(expense) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace('/not-found');
    }
  }

  async componentDidMount() {
    await this.populateExpenses();
  }

  mapToViewModel(expense) {
    console.log('mapToViewModel', expense.period);
    return {
      _id: expense._id,
      category: expense.category,
      concept: expense.concept,
      type: expense.type,
      ammount: expense.ammount,
      period: expense.period
    };
  }

  doSubmit = async () => {
    const expense = { ...this.state.data };
    const { _id } = auth.getCurrentUser();
    try {
      expense.userId = _id;
      await saveExpense(expense);
    } catch (ex) {
      console.log(ex.response);
    }

    const { history } = this.props;
    history.push('/expenses');
  };

  render() {
    return (
      <React.Fragment>
        <h3>
          Registrar Gasto
          <small className="text-muted"> > Detalles</small>
        </h3>
        <div className="border border-info rounded shadow-sm p-3 w-75 bg-white sm-10">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col">
                {this.renderInput('concept', 'Concepto')}
              </div>
            </div>
            <div className="row">
              <div className="col col-sm-3">
                {this.renderInput('ammount', 'Importe')}
              </div>
              <div className="col col-sm-2">
                {this.renderSelect('type', 'Tipo', '', this.typeOptions)}
              </div>
              <div className="col ">
                {this.renderSelect(
                  'category',
                  'Rubro',
                  '',
                  this.categoryOptions
                )}
              </div>
              <div className="col col-sm-4">
                {this.renderSelect('period', 'Mes', '', getLastXMonths(12))}
              </div>
            </div>

            <div className="row">{this.renderButton('Guardar')}</div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default ExpensesForm;
