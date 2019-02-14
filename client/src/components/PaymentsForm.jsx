import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import { getPayment, savePayment } from '../services/paymentsService';
import { getLastXMonths } from '../utils/dates';
import { getUsers } from '../services/usersService';
import { getCurrentUser } from '../services/authService';

class PaymentsForm extends Form {
  state = {
    data: {
      userId: '',
      ammount: 0,
      comments: '',
      period: ''
    },
    users: [],
    keys: {},
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    userId: Joi.string().label('Usuario'),
    ammount: Joi.number()
      .required()
      .invalid(0)
      .label('Importe'),
    comments: Joi.string()
      .allow('')
      .label('Notas'),
    period: Joi.string().label('Mes')
  };

  async populateUsers() {
    const { data: users } = await getUsers();
    this.setState({ users });
  }

  async populatePayments() {
    try {
      const paymentId = this.props.match.params.id;
      if (paymentId === 'new') return;
      const { data: payment } = await getPayment(paymentId);
      const keys = { userIdKey: payment.userId._id };
      this.setState({ data: this.mapToViewModel(payment), keys });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace('/not-found');
    }
  }

  async componentDidMount() {
    await this.populateUsers();
    await this.populatePayments();
  }

  mapToViewModel(payment) {
    return {
      _id: payment._id,
      userId: payment.userId.lastname,
      ammount: payment.ammount,
      comments: payment.comments,
      period: payment.period
    };
  }

  doSubmit = async () => {
    const payment = { ...this.state.data };
    const submittedBy = getCurrentUser();

    payment.submittedBy = submittedBy._id;
    payment.userId = this.state.keys['userIdKey'];

    try {
      console.log(payment);
      await savePayment(payment);
    } catch (ex) {
      console.log(ex.response);
    }

    const { history } = this.props;
    history.push('/payments');
  };

  render() {
    return (
      <React.Fragment>
        <h3>
          Registrar Pago
          <small className="text-muted"> > Detalles</small>
        </h3>
        <div className="border border-info rounded shadow-sm p-3 w-75 bg-white md-10">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col col-md-4">
                {this.renderSelect('period', 'Mes', '', getLastXMonths(3))}
              </div>
              <div className="col col-sm-2">
                {this.renderInput('ammount', 'Importe')}
              </div>
              <div className="col">
                {this.renderSelect(
                  'userId',
                  'Usuario',
                  'lastname',
                  this.state.users
                )}
              </div>
            </div>

            {this.renderInput('comments', 'Notas')}

            <div className="row">{this.renderButton('Guardar')}</div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default PaymentsForm;
