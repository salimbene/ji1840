import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import Select from './common/Select';
import { getUnit } from '../services/unitsService';
import { getUsers } from '../services/usersService';

class UnitsForm extends Form {
  state = {
    data: {
      fUnit: 0,
      flat: '',
      floor: 0,
      share: 0,
      landlord: ''
    },
    users: [],
    errors: {}
  };

  schema = {
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
    landlord: Joi.string().label('Propietario')
  };

  async componentDidMount() {
    const { data: users } = await getUsers();
    console.log(users);
    this.setState({ users });

    const unitId = this.props.match.params.id;
    if (unitId === 'new') return;

    const unit = await getUnit(unitId);
    if (!unit) return this.props.history.replace('/not-found');

    console.log(unit.data);
    this.setState({ data: this.mapToViewModel(unit.data) });
  }

  mapToViewModel(unit) {
    return {
      fUnit: unit.fUnit,
      flat: unit.flat,
      floor: unit.floor,
      share: unit.share,
      landlord: unit.landlord.lastname
    };
  }

  doSubmit = async () => {
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
                {this.renderSelect('lastname', 'Propietario', this.state.users)}
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
