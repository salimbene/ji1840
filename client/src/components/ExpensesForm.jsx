import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import { getExpense, saveExpense } from '../services/expensesService';
import { getModels } from '../services/pmodelsServices';
import { getLastXMonths, getPeriod } from '../utils/dates';
import auth from '../services/authService';
import { toast } from 'react-toastify';

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
      this.setState({ data: this.mapToViewModel(expense) });
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
      toast.success(`😀 Los datos se actualizaron con éxito.`, {
        position: 'top-center'
      });
    } catch (ex) {
      toast.error(`☹️ Error: ${ex.response.data}`);
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
      <span key={v} className="badge badge-pill badge-info m-1">
        <i
          key={v}
          id={v}
          className="fa fa-minus-circle"
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
              <div className="col">
                {this.renderSelect(
                  'category',
                  'Rubro',
                  '',
                  this.categoryOptions
                )}
              </div>
            </div>
            <div className="row align-items-start">
              <div className="col col-sm-4">
                {this.renderSelect('period', 'Mes', '', getLastXMonths(12))}
              </div>
              <div className="col col-sm-4">
                <div className="row">
                  <div className="col">
                    {this.renderSelect(
                      'selectedEx',
                      'Excepciones',
                      'label',
                      models
                    )}
                  </div>
                  <i
                    className="fa fa-plus-square mt-5"
                    onClick={event => this.addExcluded(selectedExKey)}
                  />
                </div>
              </div>
              <div className="col">
                {excluded && excluded.length !== 0 && (
                  <React.Fragment>
                    <div className="row">
                      <div className="col">
                        <div className="label m-1">Exclusiones</div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">{this.renderExcluded(excluded)}</div>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
            <div className="row pt-3">{this.renderButton('Guardar')}</div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default ExpensesForm;
