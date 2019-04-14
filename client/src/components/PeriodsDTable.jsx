import React, { Component } from 'react';
import CarbonTable from './common/CarbonTable';
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
      content: d => <div>{`${d.model.landlord.lastname}`}</div>
    },
    {
      path: 'model.coefficient',
      label: 'Coef.',
      content: d => (
        <div>{`${(Number(d.model.coefficient) * 100).toFixed(3)}`}</div>
      )
    },
    {
      path: 'expenseA',
      label: 'Exp (A)',
      content: d => <div className="text-right">{currency(d.expenseA)}</div>
    },
    {
      path: 'debtA',
      label: 'Deuda (A)',
      content: d => <div className="text-right">{currency(d.debtA)}</div>
    },
    {
      path: 'intA',
      label: 'Int (A)',
      content: d => <div className="text-right">{currency(d.intA)}</div>
    },
    {
      path: 'isPayedA',
      label: 'Pagó (A)',
      key: 'reg',
      content: d => (
        <div className="text-center">
          <i
            className={`clickable fa ${
              d.isPayedA ? 'fa fa-check-square-o' : 'fa fa-square-o'
            }`}
            aria-hidden="true"
            onClick={event => this.props.onRegister(d, 'isPayedA')}
          />
        </div>
      )
    },
    {
      path: 'expenseB',
      label: 'Exp. (B)',
      content: d => <div className="text-right">{currency(d.expenseB)}</div>
    },
    {
      path: 'debtB',
      label: 'Deuda (B)',
      content: d => <div className="text-right">{currency(d.debtB)}</div>
    },
    {
      path: 'intB',
      label: 'Int. (B)',
      content: d => <div className="text-right">{currency(d.intB)}</div>
    },
    {
      path: 'isPayedB',
      label: 'Pagó (B)',
      key: 'reg',
      content: d => (
        <div className="text-center">
          <i
            className={`clickable fa ${
              d.isPayedB ? 'fa fa-check-square-o' : 'fa fa-square-o'
            }`}
            aria-hidden="true"
            onClick={event => this.props.onRegister(d, 'isPayedB')}
          />
        </div>
      )
    },
    {
      path: 'total',
      label: 'Total',
      content: d => (
        <div
          className={`text-right ${
            (!d.isPayedA && !d.isPayedB) > 0 ? 'table-danger' : 'table-success'
          }`}
        >
          {currency(d.total)}
        </div>
      )
    },
    {
      path: 'isPayedFake',
      label: 'Pago Total',
      key: 'reg',
      content: d => (
        <div className="text-center">
          <i
            className={`clickable fa ${
              d.isPayedA && d.isPayedB
                ? 'fa fa-check-square-o'
                : 'fa fa-square-o'
            }`}
            aria-hidden="true"
            onClick={event => this.props.onRegister(d)}
          />
        </div>
      )
    }
  ];

  render() {
    const { data, onSort, sortColumn } = this.props;
    return (
      <CarbonTable
        columns={this.columns}
        data={data}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default PeriodsDTable;
