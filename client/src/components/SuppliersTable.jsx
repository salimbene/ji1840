import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CarbonTable from './common/CarbonTable';
import auth from '../services/authService';

class SuppliersTable extends Component {
  constructor() {
    super();
    this.currentUser = auth.getCurrentUser();
    if (this.currentUser && this.currentUser.isCouncil)
      this.columns.push(this.deleteColumn);
  }
  columns = [
    {
      path: 'name',
      label: 'Nombre',
      content: supplier => {
        return this.currentUser.isCouncil ? (
          <Link to={`/suppliers/${supplier._id}`}>{supplier.name}</Link>
        ) : (
          supplier.name
        );
      }
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
        className="fa fa-trash red clickable"
      />
    )
  };

  render() {
    const { suppliers, onSort, sortColumn } = this.props;
    return (
      <CarbonTable
        columns={this.columns}
        data={suppliers}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default SuppliersTable;
