import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Table from './common/Table';
import auth from '../services/authService';

class ExpensesTable extends Component {
  columns = [
    {
      path: 'category',
      label: 'Categoría'
    },
    {
      path: 'concept',
      label: 'Concepto'
    },
    {
      path: 'type',
      label: 'Tipo'
    },
    {
      path: 'ammount',
      label: 'Importe'
    },
    { path: 'date', label: 'Fecha' },
    {
      path: 'userId',
      label: 'Usuario'
    }
  ];

  deleteColumn = {
    key: 'del',
    content: expense => (
      <button
        onClick={event => this.props.onDelete(expense)}
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
    const { expenses, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={expenses}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default ExpensesTable;
