import React, { Component } from 'react';
import _ from 'lodash';
import Table from './common/Table';
import Select from './common/Select';
import {
  getLastXYears,
  monthLabels,
  getCurrentPeriod,
  formatDate
} from '../utils/dates';
import { getExpenses } from '../services/expensesService';

class Periods extends Component {
  state = {
    data: {},
    expenses: [],
    sortExpenses: { path: 'date', order: 'dec' },
    year: getCurrentPeriod().year,
    month: getCurrentPeriod().month
  };

  async populateExpenses() {
    const { month, year } = this.state;
    const { data: expenses } = await getExpenses(`${month} ${year}`);
    this.setState(prevState => ({ expenses }));
  }

  componentDidMount() {
    this.populateExpenses();
  }

  renderDateControls() {
    return (
      <React.Fragment>
        <p className="text-muted">Periodo Actual</p>
        <div className="row">
          <div className="col col-md-2">
            <Select
              name="month"
              label="Mes"
              value={this.state.month}
              options={monthLabels}
              onChange={this.handlePeriodSelect}
            />
          </div>
          <div className="col col-md-2">
            <Select
              name="year"
              label="Año"
              value={this.state.year}
              options={getLastXYears(5)}
              onChange={this.handlePeriodSelect}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  columnsExpenses = [
    {
      path: 'concept',
      label: 'Detalle'
    },
    {
      path: 'category',
      label: 'Rubro'
    },
    {
      path: 'ammount',
      label: 'Importe',
      content: exp => `$${exp.ammount.toFixed(2)}`
    },
    {
      path: 'type',
      label: 'Tipo'
    },
    { path: 'date', label: 'Fecha', content: exp => formatDate(exp.date) }
  ];

  handleExpensesSort = sortExpenses => {
    this.setState({ sortExpenses });
  };

  getSortedData = (data, sortColumn) => {
    const sorted = _.orderBy(data, [sortColumn.path], [sortColumn.order]);
    return sorted;
  };

  renderTable(label, data, columns, sortColumn, handleSort) {
    return (
      <React.Fragment>
        <div className="border border-info p-3 mb-3 mx-auto rounded shadow bg-white">
          <p className="text-muted">{label}</p>
          <Table
            data={data}
            columns={columns}
            sortColumn={sortColumn}
            onSort={handleSort}
            viewOnly={true}
          />
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { expenses, sortExpenses } = this.state;

    const sortedExpenses = this.getSortedData(expenses, sortExpenses);
    return (
      <React.Fragment>
        {' '}
        <div className="row">
          <div className="col">{this.renderDateControls()}</div>
        </div>
        <div className="row">
          <div className="col">
            {this.renderTable(
              'Gastos',
              sortedExpenses,
              this.columnsExpenses,
              sortExpenses,
              this.handleExpensesSort
            )}
          </div>
          <div className="col" />
        </div>
      </React.Fragment>
    );
  }
}

export default Periods;
