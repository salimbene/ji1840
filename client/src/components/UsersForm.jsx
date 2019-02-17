import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import Table from './common/Table';
import { getUnits, getUnitsOwnedBy } from '../services/unitsService';
import { getUser, getUsers, saveUser } from '../services/usersService';
import { ToastContainer, toast } from 'react-toastify';
import auth from '../services/authService';
import 'react-toastify/dist/ReactToastify.css';

class UsersForm extends Form {
  state = {
    data: {
      lastname: '',
      firstname: '',
      mail: '',
      phone: '',
      tenant: '',
      isCouncil: false,
      isLandlord: false,
      balance: 0,
      notes: ''
    },
    owned: [],
    users: [],
    units: [],
    errors: {},
    sortColumn: { path: 'fUnit', order: 'asc' },
    currentUser: ''
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
    isCouncil: Joi.boolean().label('Consejo'),
    isLandlord: Joi.boolean().label('Propietario'),
    tenant: Joi.string()
      .allow('')
      .label('Inquilino'),
    balance: Joi.number().label('Balance')
  };

  async populateUnits() {
    const { data: units } = await getUnits();
    this.setState({ units });
  }

  async populateUsers() {
    this.currentUser = auth.getCurrentUser();
    if (!this.currentUser.isCouncil) return;
    const { data: users } = await getUsers();
    this.setState({ users });
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
    await this.populateUsers();
    await this.populateOwnedBy();
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
      notes: user.notes || '',
      tenant: user.tenant || '',
      isCouncil: user.isCouncil || false,
      isLandlord: user.isLandlord || false
    };
  }

  doSubmit = async () => {
    const user = { ...this.state.data };
    try {
      await saveUser(user);
    } catch (ex) {
      console.log(`server says ${ex.response.data}`);
    }

    const { history } = this.props;
    history.push('/users');
  };

  columnsUnits = [
    { path: 'fUnit', label: 'Unidad' },
    { path: 'floor', label: 'Piso' },
    { path: 'flat', label: 'Rótulo' },
    { path: 'sup.total', label: 'Superficie' },
    { path: 'coefficient', label: 'Coeficiente' }
  ];

  columnsAccount = [
    { path: 'fUnit', label: 'Unidad' },
    { path: 'floor', label: 'Piso' },
    { path: 'flat', label: 'Rótulo' },
    { path: 'sup.total', label: 'Superficie' },
    { path: 'coefficient', label: 'Coeficiente' }
  ];

  render() {
    const { owned, sortColumn } = this.state;

    return (
      <React.Fragment>
        <ToastContainer />
        <h3>
          Usuarios
          <small className="text-muted"> > Detalles</small>
        </h3>
        <div className="border border-info rounded shadow-sm p-3 mb-5 bg-white w-50">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col">
                {this.renderInput('lastname', 'Apellido')}
              </div>
            </div>
            <div className="row">
              <div className="col">
                {this.renderInput('firstname', 'Nombre(s)')}
              </div>
            </div>
            <div className="row">
              <div className="col">{this.renderInput('mail', 'Mail')}</div>
            </div>
            <div className="row">
              <div className="col">{this.renderInput('phone', 'Telefono')}</div>
            </div>
            <div className="row">
              <div className="col">{this.renderTextArea('notes', 'Notas')}</div>
            </div>
            {this.currentUser && this.currentUser.isCouncil && (
              <React.Fragment>
                <div className="row  w-75 mx-auto">
                  <p className="h6">Administración</p>
                </div>
                <div className="row border border-danger p-3 w-75 mb-3 mx-auto rounded shadow  bg-white">
                  <div className="col p-1">
                    <div className="row">
                      <div className="col pb-1">
                        {this.renderCheck('isCouncil', 'Consejo ')}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col  pb-1">
                        {this.renderCheck('isLandlord', 'Propietario ')}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        {this.renderSelect(
                          'userId',
                          'Propietario',
                          'lastname',
                          this.state.users
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}

            <div className="row">{this.renderButton('Guardar')}</div>
          </form>
        </div>
        <div className="row">
          <div className="col">
            {' '}
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
                data={owned}
                sortColumn={sortColumn}
                onSort={this.handleSort}
                viewOnly={true}
              />
            </div>
          </div>
          <div className="col">
            <div className="border border-info p-3 mb-3 mx-auto rounded shadow bg-white">
              <p className="text-muted">Movimientos</p>
              <Table
                columns={this.columnsAccount}
                data={owned}
                sortColumn={sortColumn}
                onSort={this.handleSort}
                viewOnly={true}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default UsersForm;
