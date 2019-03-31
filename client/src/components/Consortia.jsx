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
      expA: 0,
      expB: 0,
      int: 0,
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
    expA: Joi.number()
      .allow(0)
      .required(),
    expB: Joi.number()
      .allow(0)
      .required(),
    int: Joi.number()
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
      expA: consortia.expA,
      expB: consortia.expB,
      int: consortia.int,
      balanceA: consortia.balanceA,
      balanceB: consortia.balanceB
    };
  }

  doSubmit = async () => {
    const consortia = { ...this.state.data };
    const { _id } = auth.getCurrentUser();
    if (consortia.int > 1) consortia.int = consortia.int / 100;
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
                {this.renderInput('expA', 'Expensas Ordinarias')}
              </div>
              <div className="col">
                {this.renderInput('expB', 'Expensas Extraordinarias')}
              </div>
              <div className="col">
                {this.renderInput('int', 'Interes por mora (%)')}
              </div>
            </div>
            <div className="row">
              <div className="col">
                {this.renderInput('balanceA', 'Saldo Ordinario')}
              </div>
              <div className="col">
                {this.renderInput('balanceB', 'Saldo Extraordinario')}
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
