import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Table from './common/Table';
import auth from '../services/authService';

class UsersTable extends Component {
  columns = [
    {
      path: 'lastname',
      label: 'Apellido',
      content: user => <Link to={`/users/${user._id}`}>{user.lastname}</Link>
    },
    {
      path: 'firstname',
      label: 'Nombre'
    },
    {
      path: 'balance',
      label: 'Cuenta',
      content: user => `$${Number(user.balance).toFixed(2)}`
    },
    { path: 'phone', label: 'Telefono' },
    {
      path: 'mail',
      label: 'Mail'
      // content: user => <Link to={`/users/${user._id}`}>{user.mail}</Link>
    },
    {
      path: 'isCouncil',
      label: 'Consejo'
    },
    {
      path: 'isLandlord',
      label: 'Propietario'
    }
  ];

  deleteColumn = {
    key: 'del',
    content: user => (
      <i
        onClick={event => this.props.onDelete(user)}
        className="fa fa-trash red"
      />
    )
  };

  constructor() {
    super();
    const currentUser = auth.getCurrentUser();
    if (currentUser && currentUser.isAdmin)
      this.columns.push(this.deleteColumn);
  }

  render() {
    const { users, onSort, sortColumn } = this.props;

    return (
      <React.Fragment>
        <Table
          columns={this.columns}
          data={users}
          sortColumn={sortColumn}
          onSort={onSort}
        />
      </React.Fragment>
    );
  }
}

export default UsersTable;
