import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import { toast } from 'react-toastify';
import { register } from '../services/usersService';
import auth from '../services/authService';

class RegisterForm extends Form {
  state = {
    data: { mail: '', password: '', firstname: '', lastname: '' },
    errors: {}
  };

  schema = {
    lastname: Joi.string()
      .max(255)
      .label('Apellido'),
    firstname: Joi.string()
      .max(255)
      .label('Nombre'),
    mail: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email()
      .label('Mail'),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
      .label('Clave')
  };

  componentDidMount() {
    this.setState({ user: auth.getCurrentUser() });
  }

  doSubmit = async () => {
    const { data } = this.state;
    const { lastname } = data;

    try {
      await register(this.state.data); //const response=
      toast.success(`😀 El usuario ${lastname} se registró con éxito.`, {
        position: 'top-center'
      });

      const { history } = this.props;
      history.push('/users');

      // auth.loginWithJwt(response.headers['x-auth-token']);
      // window.location = '/users';
    } catch (ex) {
      toast.error(`☹️ Error: ${ex.response.data}`);
    }
  };
  render() {
    return (
      <React.Fragment>
        <div className="rounded centered registrar">
          <div className="row">
            <h3 className="mx-auto">
              <i className="fa fa-user-plus mr-3 mb-2" />
              Registrar Usuario
            </h3>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col">
                {this.renderInput('lastname', 'Apellido')}
              </div>
            </div>
            <div className="row">
              <div className="col">
                {this.renderInput('firstname', 'Nombre')}
              </div>
            </div>
            <div className="row">
              <div className="col">{this.renderInput('mail', 'Mail')}</div>
            </div>
            <div className="row">
              <div className="col">
                {this.renderInput('password', 'Clave', 'password')}
              </div>
            </div>
            <div className="row">
              <div className="mx-auto">{this.renderButton('Acceder')}</div>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default RegisterForm;
