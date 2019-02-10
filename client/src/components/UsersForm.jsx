import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import { getUnits } from '../services/unitsService';

class UsersForm extends Form {
  state = {
    data: {
      lastname: '',
      firstname: '',
      mail: '',
      phone: '',
      role: '',
      notes: '',
      ownership: [],
      isAdmin: false,
      password: ''
    },
    users: [],
    units: [],
    errors: {}
  };

  roles = [
    {
      _id: 0,
      rol: 'Administrador'
    },
    {
      _id: 1,
      rol: 'Consejal'
    },
    {
      _id: 2,
      rol: 'Usuario'
    }
  ];

  schema = {
    lastname: Joi.string()
      .max(50)
      .label('Apellido'),
    firstname: Joi.string()
      .max(50)
      .label('Nombre'),
    mail: Joi.string()
      .min(5)
      .max(255)
      .email()
      .required()
      .label('Mail'),
    phone: Joi.string()
      .max(30)
      .label('Telefono'),
    notes: Joi.string()
      .max(500)
      .label('Notas'),
    ownership: Joi.array().label('Propiedades'),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
      .label('Password'),
    role: Joi.string().label('Rol'),
    isAdmin: Joi.boolean()
  };

  async populateUnits() {
    const { data: units } = await getUnits();
    this.setState({ units });
  }

  async populateUser() {
    try {
      const userId = this.props.match.params.id;
      if (userId === 'new') return;
      // const { data: user } = await getUser(userId);
      // this.setState({ data: this.mapToViewModel(user) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace('/not-found');
    }
  }

  async componentDidMount() {
    await this.populateUnits();
    await this.populateUser();
  }

  mapToViewModel(user) {
    return {
      _id: user._id
    };
  }

  doSubmit = async () => {
    // const user = { ...this.state.data };

    try {
      // await saveUser(user);
    } catch (ex) {
      console.log(ex.response);
    }

    const { history } = this.props;
    history.push('/users');
  };

  render() {
    return (
      <React.Fragment>
        <h3>
          Usuarios
          <small className="text-muted"> > Detalles</small>
        </h3>
        <div className="border border-info rounded shadow-sm p-3 mb-5 bg-white">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col">
                {this.renderInput('lastname', 'Apellido')}
              </div>
              <div className="col">
                {this.renderInput('firstname', 'Nombre(s)')}
              </div>
              <div className="col">{this.renderInput('mail', 'Mail')}</div>
            </div>
            <div className="row">
              <div className="col col-md-2">
                {this.renderInput('phone', 'Telefono')}
              </div>
              <div className="col col-md-2">
                {this.renderSelect('role', 'Rol', 'rol', this.roles)}
              </div>
              <div className="col ">{this.renderInput('Notas', 'Notas')}</div>
            </div>
            <div>
              <p className="text-muted">Propiedades</p>
            </div>
            <div className="row">
              <div className="col col-md-2">
                {this.renderSelect(
                  'ownership',
                  'Unidades',
                  'fUnit',
                  this.state.units
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

export default UsersForm;
