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
      content: p => `$${p.totalA.toFixed(2)}`
    },
    {
      path: 'totalB',
      label: 'Total Expensas B',
      content: p => `$${p.totalB.toFixed(2)}`
    },
    {
      path: 'totalIncome',
      label: 'Total Ingresos',
      content: p => `$${p.totalIncome.toFixed(2)}`
    },
    {
      path: 'isClosed',
      label: 'Cerrado'
    }
  ];

  deleteColumn = {
    key: 'del',
    content: period => (
      <button
        onClick={event => this.props.onDelete(period)}
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
