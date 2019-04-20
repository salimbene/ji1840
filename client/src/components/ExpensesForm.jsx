import React, { Fragment } from 'react';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';
import Form from './common/Form';
import BtnAux from './common/BtnAux';
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

  addAll = () => {
    const { models } = this.state;
    const allExcluded = [];
    for (let m of models) allExcluded.push(m._id);

    const newData = { ...this.state.data };
    newData.excluded = allExcluded;

    this.setState({ data: newData });
  };

  addExcluded(selected) {
    if (!selected) return null;
    const { excluded: newExcluded } = this.state.data;
    const newState = { ...this.state };

    //si ya existe no se vuelve a agregar
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
      <span key={v} className="bx--tag bx--tag--cool-gray cc--m5">
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
            <div className="bx--col">
              {this.renderInput('ammount', 'Importe')}
            </div>

            <div className="bx--col">
              {this.renderSelect('type', 'Tipo', '', this.typeOptions)}
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col">
              {this.renderSelect('category', 'Rubro', '', this.categoryOptions)}
            </div>
            <div className="bx--col">
              {this.renderSelect('period', 'Período', '', getLastXMonths(12))}
            </div>
          </div>
          <div className="bx--row align-items-start">
            <div className="bx--col">
              {this.renderSelect('selectedEx', 'Excepciones:', 'label', models)}
            </div>
            <div className="bx--col">
              <BtnAux
                label="Agregar"
                onClick={event => this.addExcluded(selectedExKey)}
                className="cc--mt25"
              />

              <label className="bx--label cc--ml5 cc--mr5">{' Todos'}</label>
              <svg
                onClick={event => this.addAll()}
                width="10"
                height="10"
                fillRule="evenodd"
              >
                <path d="M6 4h4v2H6v4H4V6H0V4h4V0h2v4z" />
              </svg>
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col">{this.renderButton('Guardar')}</div>
            <div className="bx--col">
              {excluded && excluded.length !== 0 && (
                <Fragment>
                  <div className="bx--row">
                    <div className="bx--col">
                      <label className="bx--label">
                        Se excluirá del pago a:
                      </label>
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
        </form>
      </div>
    );
  }
}

export default ExpensesForm;
