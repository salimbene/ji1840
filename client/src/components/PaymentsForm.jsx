import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import { getPayment, savePayment } from '../services/paymentsService';

class PaymentsForm extends Form {
  state = {
    data: {
      category: '',
      concept: '',
      type: '',
      ammount: 0,
      period: 0,
      userId: ''
    },
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    unitId: Joi.ObjectId().label('Unidad'),
    userId: Joi.ObjectId().label('Usuario'),
    ammount: Joi.number()
      .required()
      .label('Importe'),
    comments: Joi.string()
      .allow('')
      .label('Notas'),
    period: Joi.date().label('Mes')
  };

  async populatePayments() {
    try {
      const paymentId = this.props.match.params.id;
      if (paymentId === 'new') return;
      const { data: payment } = await getPayment(paymentId);
      this.setState({ data: this.mapToViewModel(payment) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace('/not-found');
    }
  }

  async componentDidMount() {
    await this.populatePayments();
  }

  mapToViewModel(payment) {
    return {
      _id: payment._id,
      unitId: payment.unitId,
      userId: payment.concept,
      ammount: payment.ammount,
      comments: payment.comments,
      period: payment.period
    };
  }

  doSubmit = async () => {
    const payment = { ...this.state.data };

    try {
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
        <div className="border border-info rounded shadow-sm p-3 mb-5 bg-white">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col">{this.renderInput('unitId', 'Unidad')}</div>
              <div className="col">{this.renderInput('userId', 'Usuario')}</div>
              <div className="col">
                {this.renderInput('ammount', 'Importe')}
              </div>
            </div>
            <div className="col col-md-2">
              {this.renderInput('comments', 'Notas')}
            </div>
            <div className="row">
              <div className="col col-md-2">
                {this.renderInput('period', 'Mes')}
              </div>
            </div>
            <div className="row">{this.renderButton('Guardar')}</div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default PaymentsForm;
