import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CarbonTable from './common/CarbonTable';
import auth from '../services/authService';

class UsersTable extends Component {
  constructor() {
    super();
    this.currentUser = auth.getCurrentUser();
    if (this.currentUser && this.currentUser.isAdmin)
      this.columns.push(this.deleteColumn);
  }

  columns = [
    {
      path: 'lastname',
      label: 'Apellido',
      content: user => {
        return this.currentUser.isCouncil ? (
          <Link to={`/users/${user._id}`}>{user.lastname}</Link>
        ) : (
          user.lastname
        );
      }
    },
    {
      path: 'firstname',
      label: 'Nombre'
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
        className="fa fa-trash red clickable"
      />
    )
  };

  render() {
    const { users, onSort, sortColumn } = this.props;

    return (
      <CarbonTable
        columns={this.columns}
        data={users}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default UsersTable;
