import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CarbonTable from './common/CarbonTable';
import auth from '../services/authService';
import { currency } from '../utils/formatter';

class PeriodsTable extends Component {
  constructor() {
    super();
    this.currentUser = auth.getCurrentUser();

    if (this.currentUser && this.currentUser.isCouncil)
      this.columns.push(this.isClosedColumn);

    if (this.currentUser && this.currentUser.isAdmin)
      this.columns.push(this.deleteColumn);
  }

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
      label: 'Expensas A',
      content: p => <div className="text-right">{currency(p.expensesA)}</div>
    },
    {
      path: 'totalIncome',
      label: 'Ingresos A',
      content: p => <div className="text-right">{currency(p.incomeA)}</div>
    },
    {
      path: 'balanceA',
      label: 'Saldo A',
      content: p => (
        <div
          className={`text-right ${
            p.balanceA > 0 ? 'table-success' : 'table-danger'
          }`}
        >
          {currency(p.balanceA)}
        </div>
      )
    },
    {
      path: 'totalB',
      label: 'Expensas B',
      content: p => <div className="text-right">{currency(p.expensesB)}</div>
    },
    {
      path: 'totalExpenses',
      label: 'Ingresos B',
      content: p => <div className="text-right">{currency(p.incomeB)}</div>
    },
    {
      path: 'balanaceB',
      label: 'Saldo B',
      content: p => (
        <div
          className={`text-right ${
            p.balanceB > 0 ? 'table-success' : 'table-danger'
          }`}
        >
          {currency(p.balanceB)}
        </div>
      )
    },
    {
      path: 'balance',
      label: 'Saldo Total',
      content: p => (
        <div
          className={`text-right ${
            p.balance > 0 ? 'table-success' : 'table-danger'
          }`}
        >
          {currency(p.balance)}
        </div>
      )
    }
  ];

  isClosedColumn = {
    path: 'isClosed',
    label: 'Cerrado',
    key: 'cls',
    content: p => (
      <div className="text-center">
        <i
          className={`fa ${
            p.isClosed ? 'fa fa-check-square-o' : 'fa fa-square-o'
          }`}
          aria-hidden="true"
          onClick={event => this.props.onClosePeriod(p)}
        />
      </div>
    )
  };

  deleteColumn = {
    key: 'del',
    content: period => (
      <i
        onClick={event => this.props.onDelete(period)}
        className="fa fa-trash red clickable"
      />
    )
  };

  render() {
    const { periods, onSort, sortColumn } = this.props;

    return (
      <CarbonTable
        columns={this.columns}
        data={periods}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default PeriodsTable;
