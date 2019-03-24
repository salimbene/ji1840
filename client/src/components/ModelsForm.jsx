import React from 'react';
import { toast } from 'react-toastify';
import Joi from 'joi-browser';
import _ from 'lodash';
import SimpleModal from './common/SimpleModal';
import Table from './common/Table';
import Form from './common/Form';
import { getModel, saveModel } from '../services/pmodelsServices';
import { getUnits } from '../services/unitsService';
import { getUsers } from '../services/usersService';
import auth from '../services/authService';

class ModelsForm extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        label: '',
        fUnits: [],
        coefficient: 0,
        landlord: '',
        selectedUnit: ''
      },
      sortUnits: { path: 'fUnit', order: 'asc' },
      units: [],
      users: [],
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
    landlord: Joi.string().label('Usuario'),
    tenant: Joi.string()
      .allow('')
      .label('Usuario'),
    selectedUnit: Joi.string()
      .required()
      .label('Unidad seleccionada'),
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
  async populateUsers() {
    const { data: users } = await getUsers();
    this.setState({ users });
  }

  async populateModels() {
    try {
      const modelId = this.props.match.params.id;
      if (modelId === 'new') return;
      const { data: model } = await getModel(modelId);

      const keys = {
        landlordKey: model.landlord._id
      };

      if (model.tenant) keys.tenantKey = model.tenant._id;

      this.setState({ data: this.mapToViewModel(model), keys });
    } catch (ex) {
      toast.error(`☹️ Error: ${ex}`);
    }
  }

  async componentDidMount() {
    await this.populateModels();
    await this.populateUnits();
    await this.populateUsers();
  }

  mapToViewModel(model) {
    return {
      _id: model._id,
      landlord: model.landlord.lastname,
      label: model.label,
      fUnits: model.fUnits,
      coefficient: model.coefficient,
      selectedUnit: 'DUMMY-UNIT'
    };
  }

  doSubmit = async () => {
    const model = { ...this.state.data };
    const { users } = this.state;
    const { landlordKey, tenantKey } = this.state.keys;

    //selectedUnit no existe en mongo
    delete model.selectedUnit;
    model.landlord = users.find(e => {
      return e._id === landlordKey;
    })._id;

    if (model.tenant)
      model.tenant = users.find(e => {
        return e._id === tenantKey;
      })._id;

    try {
      await saveModel(model);
      toast.success(`😀 Los datos se actualizaron con éxito.`, {
        position: 'top-center'
      });
    } catch (ex) {
      toast.error(`☹️ Error: ${ex.response.data}`);
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
        type="button"
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
    const { selectedUnit, data: model } = this.state;
    const { landlordKey, tenantKey } = this.state.keys;

    model.fUnits = model.fUnits.filter(u => u._id !== selectedUnit._id);
    model.landlord = landlordKey;
    model.tenant = tenantKey;

    this.setState({ model });

    // try {
    //   this.doSubmit();
    //   toast.success(`😀 Los datos se actualizaron con éxito.`, {
    //     position: 'top-center'
    //   });
    // } catch (ex) {
    //   toast.error(`☹️ Error: ${ex.response.data}`);
    //   this.setState({ models: rollback });
    // }
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

  bodyDelUnit = () => {
    return (
      <p className="lead">
        Eliminar una asigación puede ocacionar inconsistencia de datos.
      </p>
    );
  };

  getUserFullName = (users, key) => {
    if (!key || users.length === 0) return '';
    const fullName = users.find(u => u._id === key);
    return `${fullName.lastname}, ${fullName.firstname}`;
  };

  render() {
    const { sortUnits, data, users, units } = this.state;
    const { landlordKey, tenantKey } = this.state.keys;
    const sortedUnits = this.getSortedData(data.fUnits, sortUnits);

    return (
      <React.Fragment>
        <SimpleModal
          isOpen={this.state.modal}
          toggle={this.toggleDelete}
          title="Eliminar unidad asignada"
          label="Eliminar"
          action={this.handleDelete}
          body={this.bodyDelUnit()}
        />
        <div className="border border-info rounded shadow-sm p-3 mb-5 bg-white adjust">
          <form onSubmit={this.handleSubmit}>
            <div className="row align-items-start">
              <div className="col-sm-12">
                {this.renderInput('label', 'Nombre')}
              </div>
            </div>
            <div className="row align-items-end">
              <div className="col-sm-5">
                {this.renderSelect(
                  'landlord',
                  'Propietario',
                  'lastname',
                  users
                )}
              </div>
              <div className="col">
                {this.getUserFullName(users, landlordKey)}
              </div>
            </div>
            <div className="row align-items-end">
              <div className="col-sm-5">
                {this.renderSelect('tenant', 'Inquilino', 'lastname', users)}
              </div>
              <div className="col">
                {this.getUserFullName(users, tenantKey)}
              </div>
            </div>
            <div className="row align-items-end">
              <div className="col-sm-3">
                {this.renderSelect('selectedUnit', 'Unidades', 'fUnit', units)}
              </div>
              <div className="col">
                <button
                  type="button"
                  onClick={event => this.handleAddModel(event)}
                  className="btn btn-info btn-sm m-1"
                >
                  Asignar
                </button>
              </div>
            </div>
            <div className="row align-items-end">
              <div className="col col-sm-6 pt-4">
                <mark>{` Coeficiente total: ${data.coefficient}`}</mark>
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
