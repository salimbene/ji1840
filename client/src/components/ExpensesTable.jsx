import React, { Component } from 'react';
import CarbonTable from './common/CarbonTable';
import auth from '../services/authService';
import { formatDate } from '../utils/dates';
import { currency } from '../utils/formatter';

class ExpensesTable extends Component {
  columns = [
    {
      path: 'concept',
      label: 'Concepto'
    },
    {
      path: 'period',
      label: 'Periodo',
      content: expense => <div className="text-center">{expense.period}</div>
    },
    {
      path: 'category',
      label: 'Categoría',
      content: expense => <div className="text-center">{expense.category}</div>
    },
    {
      path: 'type',
      label: 'Tipo',
      content: expense => <div className="text-center">{expense.type}</div>
    },
    {
      path: 'ammount',
      label: 'Importe',
      content: expense => (
        <div className="text-right">{currency(expense.ammount)}</div>
      )
    },
    {
      path: 'date',
      label: 'Fecha',
      content: expense => (
        <div className="text-center">{formatDate(expense.date)}</div>
      )
    },
    {
      path: 'userId',
      label: 'Registrante',
      content: expense => (
        <div className="text-center">{expense.userId.lastname}</div>
      )
    }
  ];

  deleteColumn = {
    key: 'del',
    content: expense => (
      <i
        onClick={event => this.props.onDelete(expense)}
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
    const { expenses, onSort, sortColumn } = this.props;

    return (
      <CarbonTable
        columns={this.columns}
        data={expenses}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default ExpensesTable;
