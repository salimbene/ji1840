import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Table from './common/Table';
import { formatDate } from '../utils/dates';
import auth from '../services/authService';

class PaymentsTable extends Component {
  columns = [
    {
      path: 'userId',
      label: 'Usuario',
      content: payment => payment.userId.lastname
    },
    {
      path: 'period',
      label: 'Mes'
    },
    {
      path: 'ammount',
      label: 'Importe',
      content: payment => `$${payment.ammount.toFixed(2)}`
    },
    {
      path: 'comments',
      label: 'Notas',
      content: payment => (
        <Link to={`/payments/${payment._id}`}>{payment.comments}</Link>
      )
    },
    {
      path: 'submittedBy',
      label: 'Registrado por',
      content: payment => payment.submittedBy.lastname
    },
    {
      path: 'date',
      label: 'Registro',
      content: payment => formatDate(payment.date)
    }
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
