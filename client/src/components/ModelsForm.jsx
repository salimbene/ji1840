import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Joi from 'joi-browser';
import _ from 'lodash';
import SimpleModal from './common/SimpleModal';
import Table from './common/Table';
import Form from './common/Form';
import { getModel, saveModel } from '../services/pmodelsServices';
import { getUnits } from '../services/unitsService';
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

    //selectedUnit no existe en mongo
    delete model.selectedUnit;

    try {
      await saveModel(model);
    } catch (ex) {
      toast(`server says: ${ex.response.data}`);
    }

    const { history } = this.props;
    history.push('/models');
  };

  handleUnitSort = sortUnits => {
    this.setState({ sortUnits });
  };

  getCoefSum = units => {
    return units.reduce((a, c) => a + c.coefficient, 0).toPrecision(3);
  };

  handleAddModel = () => {
    const { selectedUnitKey } = this.state.keys;
    const { units, data } = this.state;

    //
    const duplicate = data.fUnits.find(e => {
      return e._id === selectedUnitKey;
    });
    if (duplicate) return toast('La unidad ya se encuentra asignada.');

    const selectedUnit = units.find(e => {
      return e._id === selectedUnitKey;
    });

    const bufferUnits = data.fUnits;
    bufferUnits.push(selectedUnit);

    data.coefficient = this.getCoefSum(bufferUnits);

    this.setState({ fUnits: bufferUnits, data });
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
    const { selectedUnit, models: rollback, data: model } = this.state;

    model.fUnits = model.fUnits.filter(u => u._id !== selectedUnit._id);

    this.setState({ model });

    try {
      this.doSubmit();
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast(ex.response.data);
        this.setState({ models: rollback });
      }
    }
    this.toggleDelete();
  };

  renderProps(data, sortColumn) {
    return (
      <React.Fragment>
        <div className="border border-info p-3 mb-3 mx-auto rounded shadow bg-white adjust">
          <p className="text-muted">Unidades Asignadas</p>
          <Table
            columns={this.columnsUnits}
            onDelete={this.toggleDelete}
            data={data}
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
        <div className="border border-info rounded shadow-sm p-3 mb-5 bg-white adjust">
          <form onSubmit={this.handleSubmit}>
            <div className="row align-items-start">
              <div className="col-sm-12">
                {this.renderInput('label', 'Nombre')}
              </div>
            </div>
            <div className="row ">
              <div className="col-sm-4">
                {this.renderSelect(
                  'selectedUnit',
                  'Unidades',
                  'fUnit',
                  this.state.units
                )}
                <button
                  type="button"
                  onClick={event => this.handleAddModel(event)}
                  className="btn btn-info btn-sm ml-2 mt-1"
                >
                  Asignar
                </button>
              </div>
              <div className="col align-self-center">
                <mark>{` Coeficiente total: ${data.coefficient}`}</mark>
              </div>
            </div>
            <div className="row">
              <div className="col col-sm-6 pt-4">
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
