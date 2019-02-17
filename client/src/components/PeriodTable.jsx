import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Table from './common/Table';
import auth from '../services/authService';
import { formatDate } from '../utils/dates';

class PeriodTable extends Component {
  columns = [
    {
      path: 'landlord', //from users
      label: 'Propietario'
    },
    {
      path: 'period', //from users
      label: 'Periodo'
    },
    {
      path: 'coefficient', //from users
      label: 'Participación'
    },
    {
      path: 'expense', //from consortia
      label: 'Expensas'
    },
    {
      path: 'payment', //Tomo los pagos realizados a un periodo
      label: 'Pago',
      content: period => `$${period.ammount.toFixed(2)}`
    },
    {
      path: 'debt', //from users
      label: 'Deuda',
      content: period => formatDate(period.date)
    },
    {
      path: 'interests', //from consortia
      label: 'Deuda',
      content: period => formatDate(period.date)
    },
    {
      path: 'total',
      label: 'Total',
      content: period => period.userId.lastname
    }
  ];

  render() {
    const { period, onSort, sortColumn, viewOnly, caption } = this.props;

    if (!viewOnly) this.columns[0] = this.conceptColumn;

    return (
      <Table
        columns={this.columns}
        data={period}
        sortColumn={sortColumn}
        onSort={onSort}
        viewOnly={viewOnly}
        caption={caption}
      />
    );
  }
}

export default PeriodTable;
