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
    { path: 'role', label: 'Rol' },
    {
      path: 'mail',
      label: 'Mail',
      content: user => <Link to={`/users/${user._id}`}>{user.mail}</Link>
    },
    { path: 'phone', label: 'Telefono' },
    {
      path: 'ownership',
      label: 'Propiedades',
      content: user => <Link to={`/users/${user._id}`}>{user.lastname}</Link>
    }
  ];

  deleteColumn = {
    key: 'del',
    content: user => (
      <button
        onClick={event => this.props.onDelete(user)}
        className="btn btn-danger btn-sm"
      >
        Eliminar
      </button>
    )
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.columns.push(this.deleteColumn);
  }

  render() {
    const { units, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={units}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default UsersTable;
