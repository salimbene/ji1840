import React, { Component } from 'react';
import Table from './common/Table';
import auth from '../services/authService';
import { currency } from '../utils/formatter';

class PeriodsDTable extends Component {
  columns = [
    {
      path: 'model.label',
      label: 'UF'
    },
    {
      path: 'model.landlord.lastname',
      label: 'Propietario',
      content: m => <div>{`${m.model.landlord.lastname}`}</div>
    },
    {
      path: 'model.coefficient',
      label: 'Coef.',
      content: m => (
        <div>{`${(Number(m.model.coefficient) * 100).toFixed(3)}`}</div>
      )
    },
    {
      path: 'expenseA',
      label: 'Exp. A',
      content: m => <div className="text-right">{currency(m.expenseA)}</div>
    },
    {
      path: 'debtA',
      label: 'Exp. B',
      content: m => <div className="text-right">{currency(m.debtA)}</div>
    },
    {
      path: 'intA',
      label: 'Mora',
      content: m => <div className="text-right">{currency(m.intA)}</div>
    },
    {
      path: 'expenseB',
      label: 'Exp. A',
      content: m => <div className="text-right">{currency(m.expenseB)}</div>
    },
    {
      path: 'debtB',
      label: 'Exp. B',
      content: m => <div className="text-right">{currency(m.debtB)}</div>
    },
    {
      path: 'intB',
      label: 'Mora',
      content: m => <div className="text-right">{currency(m.intB)}</div>
    },
    {
      path: 'total',
      label: 'Total',
      content: m => <div className="text-right">{currency(m.total)}</div>
    }
  ];

  registerColumn = {
    path: 'isPayedA',
    label: 'Pagar',
    key: 'reg',
    content: model => (
      <div className="text-center">
        <i
          className={`fa ${
            model.isPayed ? 'fa fa-check-square-o' : 'fa fa-square-o'
          }`}
          aria-hidden="true"
          onClick={event => this.props.onRegister(model)}
        />
      </div>
    )
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.columns.push(this.registerColumn);
  }

  render() {
    const { data, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={data}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default PeriodsDTable;
