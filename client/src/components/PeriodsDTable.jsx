import React, { Component } from 'react';
import Table from './common/Table';
import auth from '../services/authService';

class PeriodsDTable extends Component {
  columns = [
    {
      path: 'model',
      label: 'Agente',
      content: m => <div>{m.model.label}</div>
    },
    {
      path: 'expenses',
      label: 'Expensas A',
      content: m => `$${Number(m.expenses).toFixed(2)}`
    },
    {
      path: 'extra',
      label: 'Expensas B',
      content: m => `$${Number(m.extra).toFixed(2)}`
    },
    {
      path: 'debt',
      label: 'Mora',
      content: m => `$${Number(m.debt).toFixed(2)}`
    },
    {
      path: 'int',
      label: 'Intereses',
      content: m => `$${Number(m.int).toFixed(2)}`
    },
    {
      path: 'fakePath',
      label: 'Total',
      content: m =>
        `$${Number(m.expenses + m.extra + m.debt + m.int).toFixed(2)}`
    },
    {
      path: 'isPayed',
      label: 'Pagó'
    }
  ];

  registerColumn = {
    key: 'reg',
    content: model => (
      <button
        onClick={event => this.props.onRegister(model)}
        className="btn btn-light btn-sm"
        disabled={model.isPayed}
      >
        Pagó
      </button>
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
