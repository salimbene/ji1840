import React, { Component } from 'react';
import Table from './common/Table';
import auth from '../services/authService';

class PeriodsDTable extends Component {
  columns = [
    {
      path: 'model.label',
      label: 'UF'
    },
    {
      path: 'm.model.landlord',
      label: 'Propietario',
      content: m => <div>{`${m.model.landlord.lastname}`}</div>
    },
    {
      path: 'model.coefficient',
      label: 'Coef.',
      content: m => (
        <div>{`${(Number(m.model.coefficient) * 100).toPrecision(4)}`}</div>
      )
    },
    {
      path: 'expenses',
      label: 'Exp. A',
      content: m => `$${Number(m.expenses).toFixed(2)}`
    },
    {
      path: 'extra',
      label: 'Exp. B',
      content: m => `$${Number(m.extra).toFixed(2)}`
    },
    {
      path: 'debt',
      label: 'Mora',
      content: m => `$${Number(m.debt).toFixed(2)}`
    },
    {
      path: 'int',
      label: 'Int.',
      content: m => `$${Number(m.int).toFixed(2)}`
    },
    {
      path: 'total',
      label: 'Total',
      content: m => `$${Number(m.total).toFixed(2)}`
    }
  ];

  registerColumn = {
    path: 'isPayed',
    label: 'Pagar',
    key: 'reg',
    content: model => (
      <i
        className={`fa ${
          model.isPayed ? 'fa fa-check-square-o' : 'fa fa-square-o'
        }`}
        aria-hidden="true"
        onClick={event => this.props.onRegister(model)}
      />
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
