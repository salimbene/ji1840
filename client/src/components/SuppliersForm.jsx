import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import { getSuppier, saveSupplier } from '../services/suppliersService';

class SuppliersForm extends Form {
  state = {
    data: {
      name: '',
      category: '',
      contact: '',
      comments: ''
    },
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string()
      .required()
      .label('Nombre'),
    category: Joi.string()
      .required()
      .label('Rubro'),
    contact: Joi.string()
      .required()
      .label('Contacto'),
    comments: Joi.string()
      .allow('')
      .label('Observaciones')
  };

  async populateSuppliers() {
    try {
      const supplierId = this.props.match.params.id;
      if (supplierId === 'new') return;
      const { data: supplier } = await getSuppier(supplierId);
      this.setState({ data: this.mapToViewModel(supplier) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace('/not-found');
    }
  }

  async componentDidMount() {
    await this.populateSuppliers();
  }

  mapToViewModel(supplier) {
    return {
      _id: supplier._id,
      name: supplier.name,
      category: supplier.category,
      contact: supplier.contact,
      comments: supplier.comments
    };
  }

  doSubmit = async () => {
    const supplier = { ...this.state.data };

    try {
      await saveSupplier(supplier);
    } catch (ex) {
      console.log(ex.response);
    }

    const { history } = this.props;
    history.push('/suppliers');
  };

  render() {
    return (
      <React.Fragment>
        <h3>
          Registrar Proveedor
          <small className="text-muted"> > Detalles</small>
        </h3>
        <div className="border border-info rounded shadow-sm p-3 mb-5 bg-white">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col">{this.renderInput('name', 'Nombre')}</div>
              <div className="col">
                {this.renderInput('category', 'Categoria')}
              </div>
              <div className="col">
                {this.renderInput('contact', 'Contacto')}
              </div>
            </div>
            <div className="col col-md-2">
              {this.renderInput('comments', 'Observaciones')}
            </div>
            <div className="row">{this.renderButton('Guardar')}</div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default SuppliersForm;
