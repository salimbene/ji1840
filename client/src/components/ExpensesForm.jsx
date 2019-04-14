import React, { Fragment } from 'react';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';
import Form from './common/Form';
import { getExpense, saveExpense } from '../services/expensesService';
import { getModels } from '../services/pmodelsServices';
import { getLastXMonths, getPeriod } from '../utils/dates';
import auth from '../services/authService';

class ExpensesForm extends Form {
  state = {
    data: {
      category: '',
      concept: '',
      type: '',
      ammount: 0,
      period: getPeriod(new Date()),
      excluded: [],
      selectedEx: ''
    },
    models: [],
    errors: {},
    keys: {}
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
    excluded: Joi.array(),
    selectedEx: Joi.string().allow(''),
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
      const currentUser = auth.getCurrentUser();
      this.setState({ data: this.mapToViewModel(expense), currentUser });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace('/not-found');
    }
  }

  async populateModels() {
    const { data: models } = await getModels();
    this.setState({ models });
  }
  async componentDidMount() {
    await this.populateExpenses();
    await this.populateModels();
  }

  mapToViewModel(expense) {
    return {
      _id: expense._id,
      category: expense.category,
      concept: expense.concept,
      type: expense.type,
      ammount: expense.ammount,
      excluded: expense.excluded,
      period: expense.period,
      selectedEx: 'DUMMY-EX'
    };
  }

  doSubmit = async () => {
    const expense = { ...this.state.data };
    const { _id } = auth.getCurrentUser();
    try {
      expense.userId = _id;
      delete expense.selectedEx;
      await saveExpense(expense);
      toast.success(`Los datos se guardaron exitosamente. ✔️`, {
        position: 'top-center'
      });
    } catch (ex) {
      console.log(ex.response.data);
    }

    const { history } = this.props;
    history.push('/expenses');
  };

  addExcluded(selected) {
    const { excluded: newExcluded } = this.state.data;
    const newState = { ...this.state };

    const newEx = newExcluded.find(e => e === selected);
    if (newEx) return;

    newExcluded.push(selected);
    newState.data.excluded = newExcluded;
    this.setState({ ...newState });
  }

  getLabel(id) {
    const { models } = this.state;
    if (models.length === 0) return;
    return models.find(m => m._id === id).label;
  }

  delEx = event => {
    const { excluded } = this.state.data;
    const newState = { ...this.state };

    const newExcluded = excluded.filter(e => e !== event.target.id);
    newState.data.excluded = newExcluded;
    this.setState({ ...newState });
  };

  renderExcluded(excluded) {
    if (excluded.length === 0) return;
    return excluded.map((v, i) => (
      <span key={v} className="cc--m5">
        <i
          key={v}
          id={v}
          className="fa fa-minus-circle clickable"
          onClick={event => this.delEx(event)}
        />{' '}
        {this.getLabel(v)}
      </span>
    ));
  }

  render() {
    const { models } = this.state;
    const { excluded } = this.state.data;
    const { selectedExKey } = this.state.keys;

    return (
      <div className="bx--grid cc--users-form">
        <form onSubmit={this.handleSubmit}>
          <div className="bx--row">
            <div className="bx--col">
              {this.renderInput('concept', 'Concepto')}
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col bx--col-sm-3">
              {this.renderInput('ammount', 'Importe')}
            </div>

            <div className="bx--col bx--col-sm-2">
              {this.renderSelect('type', 'Tipo', '', this.typeOptions)}
            </div>
            <div className="bx--col">
              {this.renderSelect('category', 'Rubro', '', this.categoryOptions)}
            </div>
          </div>
          <div className="bx--row align-items-start">
            <div className="bx--col">
              {this.renderSelect('period', 'Mes', '', getLastXMonths(12))}
            </div>

            <div className="bx--col">
              {this.renderSelect('selectedEx', 'Excepciones', 'label', models)}

              <button
                className="bx--btn bx--btn--sm bx--btn--secondary"
                onClick={event => this.addExcluded(selectedExKey)}
                type="button"
              >
                {' '}
                Agregar
                <svg
                  focusable="false"
                  preserveAspectRatio="xMidYMid meet"
                  // style="will-change: transform;"
                  xmlns="http://www.w3.org/2000/svg"
                  className="bx--btn__icon"
                  width="20"
                  height="20"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M17 15V7h-2v8H7v2h8v8h2v-8h8v-2h-8z" />
                </svg>
              </button>
            </div>
            <div className="bx--col">
              {excluded && excluded.length !== 0 && (
                <Fragment>
                  <div className="bx--row">
                    <div className="bx--col">
                      <label className="bx--label">Exclusiones</label>
                    </div>
                  </div>
                  <div className="bx--row">
                    <div className="bx--col">
                      {this.renderExcluded(excluded)}
                    </div>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col">{this.renderButton('Guardar')}</div>
          </div>
        </form>
      </div>
    );
  }
}

export default ExpensesForm;
