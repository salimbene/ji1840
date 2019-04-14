import React, { Fragment } from 'react';
import { toast } from 'react-toastify';
import Joi from 'joi-browser';
import _ from 'lodash';
import CarbonModal from './common/CarbonModal';
import CarbonTable from './common/CarbonTable';
import BtnAux from './common/BtnAux';
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

    const currentUser = auth.getCurrentUser();
    if (currentUser && currentUser.isAdmin)
      this.columnsUnits.push(this.deleteColumn);

    this.toggleDelete = this.toggleDelete.bind(this);
  }

  schema = {
    _id: Joi.string(),
    label: Joi.string()
      .required()
      .label('Nombre'),
    landlord: Joi.string().label('Propietario'),
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
    const modelId = this.props.match.params.id;
    if (modelId === 'new') return;
    const { data: model } = await getModel(modelId);

    const keys = {
      landlordKey: model.landlord._id
    };

    this.setState({ data: this.mapToViewModel(model), keys });
  }

  async componentDidMount() {
    await this.populateModels();
    await this.populateUnits();
    await this.populateUsers();
  }

  mapToViewModel(model) {
    return {
      _id: model._id,
      landlord: model.landlord._id,
      label: model.label,
      fUnits: model.fUnits,
      coefficient: model.coefficient,
      selectedUnit: 'DUMMY-UNIT'
    };
  }

  doSubmit = async () => {
    const model = { ...this.state.data };
    const { users } = this.state;
    const { landlordKey } = this.state.keys;

    //selectedUnit no existe en mongo
    delete model.selectedUnit;
    model.landlord = users.find(e => {
      return e._id === landlordKey;
    })._id;

    try {
      await saveModel(model);
      toast.success(`Los datos se guardaron exitosamente. ✔️`, {
        position: 'top-center'
      });
    } catch (ex) {
      console.log(ex.response);
    }

    const { history } = this.props;
    history.push('/models');
  };

  handleUnitSort = sortUnits => {
    this.setState({ sortUnits });
  };

  getCoefSum = units => {
    console.log('coef');
    return units.reduce((a, c) => a + c.coefficient, 0);
  };

  handleAddModel = () => {
    const { selectedUnitKey } = this.state.keys;
    const { units, data } = this.state;

    //
    const duplicate = data.fUnits.find(e => {
      return e._id === selectedUnitKey;
    });
    if (duplicate) return toast.info('La unidad ya se encuentra asignada.');

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
          {Number(u.sup.total).toFixed(2)}m<sup>2</sup>
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
      <i
        onClick={event => this.toggleDelete(model)}
        className="fa fa-trash red clickable"
      />
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
    const { landlordKey } = this.state.keys;

    model.fUnits = model.fUnits.filter(u => u._id !== selectedUnit._id);
    model.landlord = landlordKey;
    model.coefficient = this.getCoefSum(model.fUnits);
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
      <CarbonTable
        columns={this.columnsUnits}
        onDelete={this.toggleDelete}
        data={data}
        sortColumn={sortColumn}
        onSort={this.handleUnitSort}
      />
    );
  }

  getSortedData = (data, sortColumn) => {
    const sorted = _.orderBy(data, [sortColumn.path], [sortColumn.order]);
    return sorted;
  };

  modalBody = unit => {
    const { fUnit } = unit;
    return (
      <p className="lead">
        Se desaginará la unidad <mark>{fUnit}</mark> al usuario.
      </p>
    );
  };

  modalProps = selectedUnit => ({
    isOpen: this.state.modal,
    title: 'Elilminar asignación',
    label: 'Consortia - Jose Ingenieros 1840',
    body: selectedUnit && this.modalBody(selectedUnit),
    cancelBtnLabel: 'Cancelar',
    submitBtnLabel: 'Confirmar',
    toggle: this.toggleDelete,
    submit: this.handleDelete,
    danger: true
  });

  render() {
    const { sortUnits, data, users, units, selectedUnit } = this.state;
    // const { landlordKey } = this.state.keys;
    const sortedUnits = this.getSortedData(data.fUnits, sortUnits);

    return (
      <Fragment>
        <CarbonModal {...this.modalProps(selectedUnit)} />
        <div className="bx--grid cc--users-form">
          <form onSubmit={this.handleSubmit}>
            <div className="bx--row">
              <div className="bx--col">
                {this.renderInput('label', 'Nombre')}
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--col">
                {this.renderSelect(
                  'landlord',
                  'Propietario',
                  '_id',
                  users,
                  true
                )}
              </div>
              <div className="bx--col">
                {this.renderSelect('selectedUnit', 'Unidades', 'fUnit', units)}
                <BtnAux
                  label="Asignar"
                  onClick={event => this.handleAddModel(event)}
                />
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--col">
                <mark>{` Coeficiente total: ${Number(data.coefficient).toFixed(
                  2
                )}`}</mark>
                {this.renderProps(sortedUnits, sortUnits)}
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--col">{this.renderButton('Guardar')}</div>
            </div>
          </form>
        </div>
      </Fragment>
    );
  }
}

export default ModelsForm;
