import React, { Component } from 'react';
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
      label: 'Detalle'
    },
    {
      path: 'type',
      label: 'Tipo'
    },
    {
      path: 'ammount',
      label: 'Importe'
    },
    {
      path: 'date',
      label: 'Fecha de registro'
    },
    {
      path: 'user',
      label: 'Registrado por'
    }
  ];

  deleteColumn = {
    key: 'del',
    content: exp => (
      <button
        onClick={event => this.props.onDelete(exp)}
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
