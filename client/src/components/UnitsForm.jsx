import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import { getUnit, addUnit, updateUnit } from '../services/unitsService';
import { getUsers } from '../services/usersService';

class UnitsForm extends Form {
  state = {
    data: {
      fUnit: 0,
      flat: '',
      floor: 0,
      share: 0,
      userId: ''
    },
    users: [],
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    fUnit: Joi.number()
      .required()
      .label('Unidad'),
    floor: Joi.number()
      .max(2)
      .required()
      .label('Piso'),
    flat: Joi.string()
      .min(1)
      .max(2)
      .required()
      .label('Depto'),
    share: Joi.number()
      .required()
      .label('Share'),
    userId: Joi.string()
      .required()
      .label('Propietario') //No validation
  };

  async componentDidMount() {
    const { data: users } = await getUsers();
    this.setState({ users });

    const unitId = this.props.match.params.id;
    if (unitId === 'new') return;

    const unit = await getUnit(unitId);
    if (!unit) return this.props.history.replace('/not-found');

    this.setState({ data: this.mapToViewModel(unit.data) });
  }

  mapToViewModel(unit) {
    return {
      _id: unit._id,
      fUnit: unit.fUnit,
      flat: unit.flat,
      floor: unit.floor,
      share: unit.share,
      userId: unit.landlord.userId
    };
  }

  doSubmit = async () => {
    const unitId = this.props.match.params.id;

    const { data, users } = this.state;
    const fUnit = { ...data };

    fUnit.userId = fUnit.userId || '5c58ae683ce66232d93fff7c';
    console.log(fUnit);

    fUnit.landlord = {
      userId: fUnit.userId,
      name: users.find(u => u._id === fUnit.userId).lastname || 'vacante'
    };

    delete fUnit.userId;

    if (unitId === 'new') {
      try {
        await addUnit(fUnit);
      } catch (ex) {
        console.log(ex.response);
      }

      return;
    }

    try {
      await updateUnit(fUnit);
    } catch (ex) {
      console.log(ex.response);
    }

    const { history } = this.props;
    history.push('/units');
  };

  render() {
    const { match } = this.props;

    return (
      <React.Fragment>
        <h1>Unit Form {match.params.id}</h1>
        <div className="rounded centered gray units--form">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col col-md-3">
                {' '}
                {this.renderInput('fUnit', 'Unidad')}
              </div>
              <div className="col col-md-3">
                {this.renderInput('floor', 'Piso')}
              </div>
              <div className="col col-md-3">
                {this.renderInput('flat', 'Depto')}
              </div>
            </div>
            <div className="row">
              <div className="col col-md-3">
                {this.renderInput('share', 'Participación')}
              </div>
              <div className="col col-md-6">
                {this.renderSelect(
                  'userId',
                  'Propietario',
                  'lastname',
                  this.state.users
                )}
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
