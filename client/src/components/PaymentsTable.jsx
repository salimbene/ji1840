import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Table from './common/Table';
import auth from '../services/authService';

class PaymentsTable extends Component {
  columns = [
    {
      path: 'unitId',
      label: 'Unidad'
    },
    {
      path: 'userId',
      label: 'Usuario'
    },
    {
      path: 'ammount',
      label: 'Importe'
    },
    {
      path: 'comments',
      label: 'Notas'
    },
    { path: 'date', label: 'Fecha' }
  ];

  deleteColumn = {
    key: 'del',
    content: payment => (
      <button
        onClick={event => this.props.onDelete(payment)}
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
    const { payments, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={payments}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default PaymentsTable;
