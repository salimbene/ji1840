import React, { Fragment } from 'react';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';
import Form from './common/Form';
import { getUser, saveUser } from '../services/usersService';
import auth from '../services/authService';

class UsersForm extends Form {
  state = {
    data: {
      lastname: '',
      firstname: '',
      mail: '',
      phone: '',
      notes: '',
      balance: 0,
      isCouncil: false,
      isLandlord: false
    },
    errors: {},
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
    balance: Joi.number().label('Balance'),
    isCouncil: Joi.boolean().label('Consejo'),
    isLandlord: Joi.boolean().label('Propietario')
  };

  async populateUser() {
    try {
      const userId = this.props.match.params.id;
      if (userId === 'new') return;
      const { data: user } = await getUser(userId);
      const currentUser = auth.getCurrentUser();
      this.setState({ data: this.mapToViewModel(user), currentUser });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace('/not-found');
    }
  }

  async componentDidMount() {
    await this.populateUser();
  }

  mapToViewModel(user) {
    return {
      _id: user._id,
      lastname: user.lastname || '',
      firstname: user.firstname || '',
      mail: user.mail,
      phone: user.phone || '',
      notes: user.notes || '',
      balance: user.balance,
      isCouncil: user.isCouncil || false,
      isLandlord: user.isLandlord || false
    };
  }

  doSubmit = async () => {
    const user = { ...this.state.data };

    try {
      await saveUser(user);
      toast.success(`Los datos se guardaron exitosamente. ✔️`, {
        position: 'top-center'
      });
      const { history } = this.props;
      history.push('/users');
    } catch (ex) {
      console.log(ex.response.data);
    }
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

  renderAdmin(currentUser) {
    if (!currentUser.isCouncil) return null;

    return (
      <Fragment>
        <div className="bx--row">
          <div className="bx--col">
            {this.renderCheck('isCouncil', 'Es miembro del consejo ')}
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col">
            {this.renderCheck('isLandlord', 'Es propietario')}
          </div>
        </div>
      </Fragment>
    );
  }

  render() {
    const { currentUser } = this.state;
    return (
      <div className="bx--grid cc--users-form">
        <form onSubmit={this.handleSubmit}>
          <div className="bx--row">
            <div className="bx--col">
              {this.renderInput('lastname', 'Apellido')}
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col">
              {this.renderInput('firstname', 'Nombre(s)')}
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col">{this.renderInput('mail', 'Mail')}</div>
          </div>
          <div className="bx--row">
            <div className="bx--col">
              {this.renderInput('phone', 'Telefono')}
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col">
              {this.renderTextArea('notes', 'Notas')}
            </div>
          </div>
          {this.renderAdmin(currentUser)}
          <div className="bx--row">
            <div className="bx--col">{this.renderButton('Guardar')}</div>
          </div>
        </form>
      </div>
    );
  }
}

export default UsersForm;
