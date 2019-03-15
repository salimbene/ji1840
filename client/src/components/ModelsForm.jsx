import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import { getModel, saveModel } from '../services/pmodelsServices';

class ModelsForm extends Form {
  state = {
    data: {
      label: '',
      fUnits: [],
      coefficient: 0
    },
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    label: Joi.string()
      .required()
      .label('Nombre'),
    fUnits: Joi.array()
      .required()
      .label('Unidades'),
    coefficient: Joi.number()
      .required()
      .label('Coeficiente')
  };

  async populateModels() {
    try {
      const modelId = this.props.match.params.id;
      if (modelId === 'new') return;
      const { data: model } = await getModel(modelId);
      this.setState({ data: this.mapToViewModel(model) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace('/not-found');
    }
  }

  async componentDidMount() {
    await this.populateModels();
  }

  mapToViewModel(model) {
    return {
      _id: model._id,
      name: model.name,
      category: model.category,
      contact: model.contact,
      comments: model.comments
    };
  }

  doSubmit = async () => {
    const model = { ...this.state.data };

    try {
      await saveModel(model);
    } catch (ex) {
      console.log(ex.response);
    }

    const { history } = this.props;
    history.push('/models');
  };

  render() {
    return (
      <React.Fragment>
        <h3>
          Registrar Modelo lala
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
            <div className="row">
              <div className="col">
                {this.renderInput('comments', 'Observaciones')}
              </div>
            </div>

            <div className="row">{this.renderButton('Guardar')}</div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default ModelsForm;
