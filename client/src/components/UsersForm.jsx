import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import Table from './common/Table';
import { getUnits, getUnitsOwnedBy } from '../services/unitsService';
import { getUser, saveUser } from '../services/usersService';

class UsersForm extends Form {
  state = {
    data: {
      lastname: '',
      firstname: '',
      mail: '',
      phone: '',
      role: '',
      notes: ''
    },
    owned: [],
    roles: [],
    units: [],
    errors: {},
    sortColumn: { path: 'fUnit', order: 'asc' }
  };

  schema = {
    _id: Joi.string(),
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
      .allow('')
      .label('Telefono'),
    notes: Joi.string()
      .max(500)
      .allow('')
      .label('Notas'),
    role: Joi.string().label('Rol')
  };

  async populateUnits() {
    const { data: units } = await getUnits();
    this.setState({ units });
  }

  async populateUser() {
    try {
      const userId = this.props.match.params.id;
      if (userId === 'new') return;
      const { data: user } = await getUser(userId);
      this.setState({ data: this.mapToViewModel(user) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace('/not-found');
    }
  }

  populateRoles() {
    const roles = [
      {
        _id: '0',
        role: 'Administrador'
      },
      {
        _id: '1',
        role: 'Consejal'
      },
      {
        _id: '2',
        role: 'Usuario'
      }
    ];
    this.setState({ roles });
  }

  async populateOwnedBy() {
    try {
      const userId = this.props.match.params.id;
      if (userId === 'new') return;
      const { data: owned } = await getUnitsOwnedBy(userId);

      this.setState({ owned });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace('/not-found');
    }
  }

  async componentDidMount() {
    await this.populateUnits();
    await this.populateUser();
    await this.populateOwnedBy();
    this.populateRoles();
  }
  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  mapToViewModel(user) {
    return {
      _id: user._id,
      lastname: user.lastname || '',
      firstname: user.firstname || '',
      mail: user.mail,
      phone: user.phone || '',
      role: user.role || '',
      notes: user.notes || ''
    };
  }

  doSubmit = async () => {
    const user = { ...this.state.data };

    try {
      await saveUser(user);
    } catch (ex) {
      console.log(ex.response);
    }

    const { history } = this.props;
    history.push('/users');
  };

  columns = [
    { path: 'fUnit', label: 'Unidad' },
    { path: 'floor', label: 'Piso' },
    { path: 'flat', label: 'Rótulo' },
    { path: 'sup.total', label: 'Superficie Total' },
    { path: 'coefficient', label: 'Coeficiente' }
  ];

  render() {
    const { owned, sortColumn } = this.state;
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
                {this.renderSelect('role', 'Rol', 'role', this.state.roles)}
              </div>
              <div className="col ">{this.renderInput('notes', 'Notas')}</div>
            </div>
            <div>
              <p className="text-muted">
                Propiedades
                <small>
                  <mark>{` Coeficiente total: ${owned
                    .reduce((a, c) => a + c.coefficient, 0)
                    .toPrecision(3)}`}</mark>
                </small>
              </p>
            </div>
            <Table
              columns={this.columns}
              data={owned}
              sortColumn={sortColumn}
              onSort={this.handleSort}
            />
            <div className="row">{this.renderButton('Guardar')}</div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default UsersForm;
