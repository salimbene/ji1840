import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import { getExpense, saveExpense } from '../services/expensesService';

class ExpensesForm extends Form {
  state = {
    data: {
      category: '',
      concept: '',
      type: '',
      ammount: 0,
      period: 0,
      userId: ''
    },
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    category: Joi.string()
      .allow('')
      .required()
      .label('Rubro'),
    concept: Joi.string()
      .allow('')
      .required()
      .label('Concepto'),
    type: Joi.string()
      .required()
      .label('Tipo'),
    ammount: Joi.number()
      .required()
      .label('Importe'),
    period: Joi.date()
      .required()
      .label('Mes'),
    userId: Joi.ObjectId()
  };

  async populateExpenses() {
    try {
      const expenseId = this.props.match.params.id;
      if (expenseId === 'new') return;
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
    return {
      _id: expense._id,
      category: expense.category,
      concept: expense.concept,
      type: expense.type,
      ammount: expense.ammount,
      period: expense.period,
      userId: expense.userId
    };
  }

  doSubmit = async () => {
    const expense = { ...this.state.data };

    try {
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
            </div>
            <div className="col col-md-2">
              {this.renderInput('ammount', 'Importe')}
            </div>
            <div className="row">
              <div className="col col-md-2">
                {this.renderInput('period', 'Mes')}
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
