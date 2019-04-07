import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Table from './common/Table';
import auth from '../services/authService';

class PeriodsTable extends Component {
  columns = [
    {
      path: 'period',
      label: 'Periodo',
      content: period => (
        <Link to={`/periods/${period._id}`}>{period.period}</Link>
      )
    },
    {
      path: 'totalA',
      label: 'Total Expensas A',
      content: p => `$${p.expensesA.toFixed(2)}`
    },
    {
      path: 'totalB',
      label: 'Total Expensas B',
      content: p => `$${p.expensesB.toFixed(2)}`
    },
    {
      path: 'totalIncome',
      label: 'Total Ingresos A',
      content: p => `$${p.incomeA.toFixed(2)}`
    },
    {
      path: 'totalExpenses',
      label: 'Total Ingresos B',
      content: p => `$${p.incomeB.toFixed(2)}`
    },
    {
      path: 'isClosed',
      label: 'Cerrado',
      key: 'cls',
      content: p => (
        <i
          className={`fa ${
            p.isClosed ? 'fa fa-check-square-o' : 'fa fa-square-o'
          }`}
          aria-hidden="true"
          onClick={event => this.props.onClosePeriod(p)}
        />
      )
    }
  ];

  deleteColumn = {
    key: 'del',
    content: period => (
      <i
        onClick={event => this.props.onDelete(period)}
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
    const { periods, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={periods}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default PeriodsTable;
