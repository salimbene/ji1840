import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import { getConsortia, saveConsortia } from '../services/consortiaService';
import auth from '../services/authService';
import { toast } from 'react-toastify';

class Consortia extends Form {
  state = {
    data: {
      name: '',
      address: '',
      cbu: '',
      bank: '',
      mail: '',
      expenseA: 0,
      expenseB: 0,
      interest: 0,
      balanceA: 0,
      balanceB: 0
    },
    errors: {}
  };

  schema = {
    _id: Joi.string().required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    cbu: Joi.string().required(),
    bank: Joi.string().required(),
    mail: Joi.string()
      .email()
      .required(),
    expenseA: Joi.number()
      .allow(0)
      .required(),
    expenseB: Joi.number()
      .allow(0)
      .required(),
    interest: Joi.number()
      .allow(0)
      .required(),
    balanceA: Joi.number()
      .allow(0)
      .required(),
    balanceB: Joi.number()
      .allow(0)
      .required()
  };

  async populateConsotia() {
    const { data: consortia } = await getConsortia();
    if (consortia.length === 0) return;
    this.setState({ data: this.mapToViewModel(consortia[0]) });
  }

  async componentDidMount() {
    await this.populateConsotia();
  }

  mapToViewModel(consortia) {
    return {
      _id: consortia._id,
      name: consortia.name,
      address: consortia.address,
      cbu: consortia.cbu,
      bank: consortia.bank,
      mail: consortia.mail,
      expenseA: consortia.expenseA,
      expenseB: consortia.expenseB,
      interest: consortia.interest,
      balanceA: consortia.balanceA,
      balanceB: consortia.balanceB
    };
  }

  doSubmit = async () => {
    const consortia = { ...this.state.data };
    const { _id } = auth.getCurrentUser();
    if (consortia.interest > 1) consortia.interest = consortia.interest / 100;
    await saveConsortia(consortia);
    toast.success(`😀 Los datos se actualizaron con éxito.`, {
      position: 'top-center'
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="border border-info rounded shadow-sm p-3 w-75 bg-white sm-10">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col">{this.renderInput('name', 'Nombre')}</div>
            </div>
            <div className="row">
              <div className="col">
                {this.renderInput('address', 'Domicilio')}
              </div>
              <div className="col">
                {this.renderInput('mail', 'Correo Electrónico')}
              </div>
            </div>
            <div className="row">
              <div className="col">
                {this.renderInput('bank', 'Datos Bancarios')}
              </div>
              <div className="col">{this.renderInput('cbu', 'CBU')}</div>
            </div>
            <div className="row">
              <div className="col">
                {this.renderInput('expenseA', 'Expensas A')}
              </div>
              <div className="col">
                {this.renderInput('expenseB', 'Expensas B')}
              </div>
              <div className="col">
                {this.renderInput('interest', 'Interes por mora (%)')}
              </div>
            </div>
            <div className="row">
              <div className="col">
                {this.renderInput('balanceA', 'Saldo A')}
              </div>
              <div className="col">
                {this.renderInput('balanceB', 'Saldo B')}
              </div>
            </div>
            <div className="row pt-3">{this.renderButton('Guardar')}</div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default Consortia;
