import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Table from './common/Table';
import auth from '../services/authService';
import { formatDate } from '../utils/dates';

class ExpensesTable extends Component {
  columns = [
    {
      path: 'concept',
      label: 'Concepto',
      content: expense => (
        <Link to={`/expenses/${expense._id}`}>{expense.concept}</Link>
      )
    },
    {
      path: 'category',
      label: 'Categoría'
    },
    {
      path: 'type',
      label: 'Tipo'
    },
    {
      path: 'ammount',
      label: 'Importe',
      content: expense => `$${expense.ammount.toFixed(2)}`
    },
    {
      path: 'date',
      label: 'Fecha',
      content: expense => formatDate(expense.date)
    },
    {
      path: 'userId',
      label: 'Registrado por...',
      content: expense => expense.userId.lastname
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
