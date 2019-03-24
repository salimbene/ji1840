import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Table from './common/Table';
import auth from '../services/authService';

class SuppliersTable extends Component {
  columns = [
    {
      path: 'name',
      label: 'Nombre',
      content: supplier => (
        <Link to={`/suppliers/${supplier._id}`}>{supplier.name}</Link>
      )
    },
    {
      path: 'category',
      label: 'Rubro'
    },
    {
      path: 'contact',
      label: 'Contacto'
    },
    {
      path: 'comments',
      label: 'Observaciones'
    }
  ];

  deleteColumn = {
    key: 'del',
    content: supplier => (
      <i
        onClick={event => this.props.onDelete(supplier)}
        className="fa fa-trash red"
      />
    )
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.columns.push(this.deleteColumn);
  }

  render() {
    const { suppliers, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={suppliers}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default SuppliersTable;
