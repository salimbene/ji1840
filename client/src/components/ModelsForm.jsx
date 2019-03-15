import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Joi from 'joi-browser';
import _ from 'lodash';
import SimpleModal from './common/SimpleModal';
import Table from './common/Table';
import Form from './common/Form';
import { getModel, saveModel } from '../services/pmodelsServices';
import { getUnits, getUnitsOwnedBy } from '../services/unitsService';
import auth from '../services/authService';
import 'react-toastify/dist/ReactToastify.css';

class ModelsForm extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        label: '',
        fUnits: [],
        coefficient: 0,
        selectedUnit: ''
      },
      sortUnits: { path: 'fUnit', order: 'asc' },
      units: [],
      owned: [],
      errors: {},
      keys: {},
      modal: false
    };

    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.columnsUnits.push(this.deleteColumn);

    this.toggleDelete = this.toggleDelete.bind(this);
  }

  schema = {
    _id: Joi.string(),
    label: Joi.string()
      .required()
      .label('Nombre'),
    selectedUnit: Joi.string()
      .required()
      .label('Nombre'),
    fUnits: Joi.array()
      .required()
      .label('Unidades'),
    coefficient: Joi.number()
      .required()
      .label('Coeficiente')
  };

  async populateUnits() {
    const { data: units } = await getUnits();
    this.setState({ units });
  }

  async populateModels() {
    try {
      const modelId = this.props.match.params.id;
      if (modelId === 'new') return;
      const { data: model } = await getModel(modelId);
      this.setState({ data: this.mapToViewModel(model) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace('/not-found');
    }
  }

  async componentDidMount() {
    await this.populateModels();
    await this.populateUnits();
  }

  mapToViewModel(model) {
    return {
      _id: model._id,
      label: model.label,
      fUnits: model.fUnits,
      coefficient: model.coefficient
    };
  }

  doSubmit = async () => {
    const model = { ...this.state.data };

    try {
      await saveModel(model);
    } catch (ex) {
      console.log(ex.response);
    }

    const { history } = this.props;
    history.push('/models');
  };

  handleUnitSort = sortUnits => {
    this.setState({ sortUnits });
  };

  handleAddUnit = () => {
    const { selectedUnitKey } = this.state.keys;
    const { units, data } = this.state;

    const selectedUnit = units.find(e => {
      return e._id === selectedUnitKey;
    });

    let newUnits = data.fUnits;
    newUnits.push(selectedUnit);
    this.setState({ fUnits: newUnits });
    console.log(this.state);
  };

  columnsUnits = [
    { path: 'fUnit', label: 'Unidad' },
    { path: 'floor', label: 'Piso' },
    { path: 'flat', label: 'Rótulo' },
    {
      path: 'sup.total',
      label: 'Superficie',
      content: u => (
        <p>
          {u.sup.total}m<sup>2</sup>
        </p>
      )
    },
    {
      path: 'coefficient',
      label: 'Coeficiente'
    }
  ];

  deleteColumn = {
    key: 'del',
    content: model => (
      <button
        onClick={event => this.toggleDelete(model)}
        className="btn btn-danger btn-sm"
      >
        Eliminar
      </button>
    )
  };

  toggleDelete(unit) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      selectedUnit: unit
    }));
  }

  handleDelete = () => {
    console.log('delete');
    // const { selectedUser } = this.state;
    // const rollback = this.state.models;
    // const models = this.state.models.filter(u => u._id !== selectedUser._id);
    // this.setState({ models });

    // try {
    //   // deleteUser(selectedUser._id);
    // } catch (ex) {
    //   if (ex.response && ex.response.status === 404) {
    //     toast('Something failed!');
    //     this.setState({ models: rollback });
    //   }
    // }
    this.toggleDelete();
  };

  renderProps(owned, sortColumn) {
    return (
      <React.Fragment>
        <div className="border border-info p-3 mb-3 mx-auto rounded shadow bg-white">
          <p className="text-muted">
            Propiedades
            <small>
              <mark>{` Coeficiente total: ${owned
                .reduce((a, c) => a + c.coefficient, 0)
                .toPrecision(3)}`}</mark>
            </small>
          </p>
          <Table
            columns={this.columnsUnits}
            onDelete={this.toggleDelete}
            data={owned}
            sortColumn={sortColumn}
            onSort={this.handleUnitSort}
          />
        </div>
      </React.Fragment>
    );
  }

  getSortedData = (data, sortColumn) => {
    const sorted = _.orderBy(data, [sortColumn.path], [sortColumn.order]);
    return sorted;
  };

  render() {
    const { sortUnits, data } = this.state;
    const sortedUnits = this.getSortedData(data.fUnits, sortUnits);
    return (
      <React.Fragment>
        <ToastContainer />
        <SimpleModal
          isOpen={this.state.modal}
          toggle={this.toggleDelete}
          title="Eliminar asignacion"
          label="Eliminar"
          action={this.handleDelete}
        />
        <h3>
          Registrar Modelo lala
          <small className="text-muted"> > Detalles</small>
        </h3>
        <div className="border border-info rounded shadow-sm p-3 mb-5 bg-white">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col">{this.renderInput('label', 'Nombre')}</div>
              <div className="col">
                {this.renderSelect(
                  'selectedUnit',
                  'Unidades',
                  'fUnit',
                  this.state.units
                )}
              </div>
              <div className="col-2">
                <button
                  onClick={event => this.handleAddUnit(event)}
                  className="btn btn-primary btn-sm"
                  style={{ marginBottom: 20 }}
                >
                  +
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col">
                {this.renderProps(sortedUnits, sortUnits)}
              </div>
            </div>
            <div className="row">{this.renderButton('Guardar')}</div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default ModelsForm;
