import React from 'react';
import Joi from 'joi-browser';
import _ from 'lodash';
import Form from './common/Form';
import Table from './common/Table';
import { getUnits, getUnitsOwnedBy } from '../services/unitsService';
import { getUser, getUsers, saveUser } from '../services/usersService';
import { getPaymentsByuserId } from '../services/paymentsService';
import { formatDate } from '../utils/dates';
import auth from '../services/authService';

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
    payments: [],
    owned: [],
    users: [],
    units: [],
    keys: {},
    errors: {},
    sortUnits: { path: 'fUnit', order: 'asc' },
    sortPayments: { path: 'date', order: 'dec' },
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
      const keys = { tenantKey: user.tenant };
      this.setState({ data: this.mapToViewModel(user), keys });
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

  async populatePayments() {
    const { _id } = this.state.data;

    try {
      const { data: payments } = await getPaymentsByuserId(_id);
      this.setState({ payments });
    } catch (ex) {
      console.log(ex.response.data);
    }
  }

  async componentDidMount() {
    await this.populateUnits();
    await this.populateUser();
    await this.populateUsers();
    await this.populateOwnedBy();
    await this.populatePayments();
  }

  handleUnitSort = sortUnits => {
    this.setState({ sortUnits });
  };

  handlePaymentSort = sortPayments => {
    this.setState({ sortPayments });
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
      isLandlord: user.isLandlord || false,
      balance: user.balance
    };
  }

  doSubmit = async () => {
    const user = { ...this.state.data };

    user.tenant = this.state.keys['tenantKey'];

    try {
      await saveUser(user);
    } catch (ex) {
      alert(`server says ${ex.response.data}`);
    }

    const { history } = this.props;
    history.push('/users');
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

  columnsPayments = [
    { path: 'period', label: 'Periodo' },
    { path: 'comments', label: 'Detalle' },
    {
      path: 'ammount',
      label: 'Importe',
      content: pay => `$${pay.ammount.toFixed(2)}`
    },
    { path: 'date', label: 'Fecha', content: pay => formatDate(pay.date) }
  ];

  renderForm() {
    return (
      <React.Fragment>
        <div className="border border-info rounded shadow-sm p-3 mb-5 bg-white">
          <p className="text-muted">Datos de usuario</p>
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
                        {this.renderCheck(
                          'isCouncil',
                          'Es miembro del consejo '
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col  pb-1">
                        {this.renderCheck('isLandlord', 'Es propietario')}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        {!this.state.data.isLandlord &&
                          this.renderSelect(
                            'tenant',
                            'Inquilino de:',
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
      </React.Fragment>
    );
  }

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
            data={owned}
            sortColumn={sortColumn}
            onSort={this.handleUnitSort}
            viewOnly={true}
          />
        </div>
      </React.Fragment>
    );
  }

  renderMovs(payments, sortColumn) {
    return (
      <React.Fragment>
        <div className="border border-info p-3 mb-3 mx-auto rounded shadow bg-white">
          <p className="text-muted">Movimientos</p>
          <Table
            columns={this.columnsPayments}
            data={payments}
            sortColumn={sortColumn}
            onSort={this.handlePaymentSort}
            viewOnly={true}
          />
        </div>
      </React.Fragment>
    );
  }

  renderStats() {
    const { balance } = this.state.data;
    return (
      <React.Fragment>
        <div className="border border-info p-3 mb-3 mx-auto rounded shadow bg-white">
          <p className="text-muted">Balance</p>
          <h3>
            Saldo
            <span className="badge badge-primary ml-2">
              {`$${balance.toFixed(2)}`}
            </span>
          </h3>
        </div>
      </React.Fragment>
    );
  }
  getSortedData = (data, sortColumn) => {
    const sorted = _.orderBy(data, [sortColumn.path], [sortColumn.order]);
    return sorted;
  };
  render() {
    const { owned, payments, sortUnits, sortPayments } = this.state;

    const sortedPayments = this.getSortedData(payments, sortPayments);
    const sortedUnits = this.getSortedData(owned, sortUnits);

    return (
      <React.Fragment>
        <div className="row">
          <div className="col">{this.renderForm()}</div>
          <div className="col">
            {this.renderStats()}
            {this.renderProps(sortedUnits, sortUnits)}
            {this.renderMovs(sortedPayments, sortPayments)}
          </div>
        </div>
        <div className="row">
          <div className="col" />
        </div>
      </React.Fragment>
    );
  }
}

export default UsersForm;
