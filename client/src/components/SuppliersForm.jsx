import React from 'react';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';
import Form from './common/Form';
import { getSupplier, saveSupplier } from '../services/suppliersService';

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
      const { data: supplier } = await getSupplier(supplierId);
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
      toast.success('Los datos se guardaron exitosamente. ✔️', {
        position: 'top-center'
      });
    } catch (ex) {
      console.log(ex.response);
    }

    const { history } = this.props;
    history.push('/suppliers');
  };

  render() {
    return (
      <div className="bx--grid cc--users-form">
        <form onSubmit={this.handleSubmit}>
          <div className="bx--row">
            <div className="bx--col">{this.renderInput('name', 'Nombre')}</div>
            <div className="bx--col">
              {this.renderInput('category', 'Categoria')}
            </div>
            <div className="bx--col">
              {this.renderInput('contact', 'Contacto')}
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col">
              {this.renderTextArea('comments', 'Observaciones')}
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col">{this.renderButton('Guardar')}</div>
          </div>
        </form>
      </div>
    );
  }
}

export default SuppliersForm;
