import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import { toast } from 'react-toastify';
import { getUnit, saveUnit } from '../services/unitsService';
import { getUsers } from '../services/usersService';

class UnitsForm extends Form {
  state = {
    data: {
      fUnit: '',
      flat: '',
      floor: 0,
      polygon: '',
      total: 0,
      covered: 0,
      uncovered: 0,
      semi: 0,
      coefficient: 0,
      landlordId: ''
    },
    users: [],
    errors: {},
    keys: {}
  };

  schema = {
    _id: Joi.string(),
    fUnit: Joi.string()
      .required()
      .label('Unidad'),
    floor: Joi.number()
      .max(3)
      .required()
      .label('Piso'),
    flat: Joi.string()
      .max(2)
      .label('Depto'),
    polygon: Joi.string()
      .required()
      .label('Polígono'),
    total: Joi.number()
      .required()
      .label('Superficie total'),
    covered: Joi.number().label('Superficie cubierta'),
    uncovered: Joi.number().label('Superficie descubierta'),
    semi: Joi.number().label('Superficie semidescubierta'),
    coefficient: Joi.number()
      .required()
      .label('Share'),
    landlordId: Joi.string()
      .required()
      .label('Propietario') //No validation
  };

  async populateUsers() {
    const { data: users } = await getUsers();
    this.setState({ users });
  }

  async populateUnits() {
    const unitId = this.props.match.params.id;
    if (unitId === 'new') return;
    const { data: unit } = await getUnit(unitId);
    // const keys = { lastnameKey: unit.landlord.userId._id };
    this.setState({ data: this.mapToViewModel(unit) }); //
  }

  async componentDidMount() {
    await this.populateUsers();
    await this.populateUnits();
  }

  mapToViewModel(unit) {
    return {
      _id: unit._id,
      fUnit: unit.fUnit,
      flat: unit.flat,
      floor: unit.floor,
      polygon: unit.polygon,
      total: unit.sup.total,
      covered: unit.sup.covered,
      uncovered: unit.sup.uncovered,
      semi: unit.sup.semi,
      coefficient: unit.coefficient,
      landlordId: unit.landlord.userId
    };
  }

  parseSurface = fUnit => {
    const { total, covered, uncovered, semi } = fUnit;
    delete fUnit.total;
    delete fUnit.covered;
    delete fUnit.uncovered;
    delete fUnit.semi;
    return {
      total,
      covered,
      uncovered,
      semi
    };
  };

  parseLandlord = fUnit => {
    const { users } = this.state;
    const landlordId = fUnit.landlordId;
    delete fUnit.landlordId;

    return {
      userId: landlordId || '5c5f843049580aaa01a931c9', //id de -disponible-
      name: users.find(u => u._id === landlordId).lastname
    };
  };

  handleFocus = e => {
    if (
      e.target.name === 'covered' ||
      e.target.name === 'uncovered' ||
      e.target.name === 'semi'
    ) {
      const { covered, uncovered, semi } = this.state.data;
      const data = { ...this.state.data };
      data.total = +covered + +uncovered + +semi;
      this.setState({ data });
    }
  };

  doSubmit = async () => {
    const fUnit = { ...this.state.data };

    fUnit.landlord = this.parseLandlord(fUnit);
    fUnit.sup = this.parseSurface(fUnit);

    try {
      await saveUnit(fUnit);
      toast.success('Los datos se guardaron exitosamente. ✔️', {
        position: 'top-center'
      });
    } catch (error) {
      console.log(error.response);
    }

    const { history } = this.props;
    history.push('/units');
  };

  render() {
    const { users } = this.state;
    return (
      <React.Fragment>
        <div className="border border-info rounded shadow-sm p-3 mb-5 bg-white">
          <p className="text-muted">Unidad funcional / complementaria</p>
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col">{this.renderInput('fUnit', 'Unidad')}</div>
              <div className="col">
                {this.renderInput('polygon', 'Polígono')}
              </div>
              <div className="col">
                {this.renderInput('coefficient', 'Coeficiente')}
              </div>
            </div>
            <div className="row">
              <div className="col col-md-2">
                {this.renderInput('floor', 'Piso')}
              </div>
              <div className="col col-md-2">
                {this.renderInput('flat', 'Rótulo')}
              </div>
              <div className="col">
                {this.renderSelect('landlordId', 'Propietario', '_id', users)}
              </div>
            </div>
            <div>
              <p className="text-muted">Superficie</p>
            </div>
            <div className="row">
              <div className="col">
                {this.renderInput('total', 'Total', 'text', true)}
              </div>
              <div className="col">
                {this.renderInput('covered', 'Cubierta')}
              </div>
              <div className="col">
                {this.renderInput('uncovered', 'Descubierta')}
              </div>
              <div className="col">
                {this.renderInput('semi', 'Semicubierta')}
              </div>
            </div>
            <div className="row">{this.renderButton('Guardar')}</div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default UnitsForm;
