import React, { Component } from 'react';
import _ from 'lodash';
import Table from './common/Table';
import Select from './common/Select';
import { getCurrentPeriod, formatDate } from '../utils/dates';
import { getExpenses } from '../services/expensesService';
import { getLandlords } from '../services/usersService';
import { getUnitsOwnedBy } from '../services/unitsService';
import { savePDetails } from '../services/pdetailsService';

class Periods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      users: [],
      expenses: [],
      period: [],
      sortExpenses: { path: 'date', order: 'dec' },
      sortedPeriod: { path: '', order: '' },
      currentPeriod: `${getCurrentPeriod().month} ${getCurrentPeriod().year}`
    };
    this.openPeriod = this.openPeriod.bind(this);
  }

  async populateExpenses() {
    const { month, year } = this.state;
    const { data: expenses } = await getExpenses(`${month} ${year}`);
    this.setState(prevState => ({ expenses }));
  }

  async populateLandlords() {
    let data = [];
    const { data: landlords } = await getLandlords();

    const typeA = 30000;
    const typeB = 1500;
    const intA = 1;
    const intB = 1;

    landlords.map(async (user, index) => {
      const { data: ownedUnits } = await getUnitsOwnedBy(user._id);
      const coefficient = (
        ownedUnits.reduce((a, c) => a + c.coefficient, 0) * 100
      ).toPrecision(3);

      const { lastname } = user;
      const expenseA = ((coefficient * typeA) / 100).toPrecision(3);
      const expenseB = typeB.toPrecision(3);
      const interestA = intA.toPrecision(3);
      const interestB = intB.toPrecision(3);
      const total = expenseA + expenseB + intA + intB;

      data.push({
        coefficient,
        lastname,
        expenseA,
        expenseB,
        interestA,
        interestB,
        total
      });
    });

    console.log(data);
  }

  componentDidMount() {
    this.populateExpenses();
    this.populateLandlords();
  }

  async openPeriod(typeA = 30000, typeB = 1500, intA = 0, intB = 0) {
    const { data: landlords } = await getLandlords();
    const { currentPeriod } = this.state;
    const pDetails = [];
    // const {data} = await newPeriod()

    const data = {
      period: currentPeriod,
      userId: 0,
      coefficient: 0,
      debtA: 0,
      expenseA: 0,
      interestA: 0,
      debtB: 0,
      expenseB: 0,
      interestB: 0,
      isSettledA: false,
      isSettledB: false
    };

    landlords.map(async (user, index) => {
      data.userId = user._id;

      const { data: ownedUnits } = await getUnitsOwnedBy(user._id);
      const coefficient =
        ownedUnits.reduce((a, c) => a + c.coefficient, 0) * 100;
      console.log(typeof coefficient, typeof typeA);
      data.coefficient = coefficient;
      data.debtA = 0; //fetch
      data.expenseA = (coefficient * 30000) / 100;
      data.interestA = data.debtB = 0; // calc //fetch
      data.expenseB = typeB;
      data.interestB = 0; //calc

      try {
        const { data: pdetails } = await savePDetails(data);
        pDetails.push(pdetails);
      } catch (ex) {
        console.log(ex.response.data);
      }
    });

    console.log(pDetails);
  }

  renderDateControls() {
    return (
      <React.Fragment>
        <p className="text-muted">Periodo Actual</p>
        <div className="row">
          <div className="col" />
          <div className="col">
            <button onClick={this.openPeriod}>Nuevo Periodo</button>
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

  columnsPeriod = [
    {
      path: 'unit',
      label: 'UF'
    },
    {
      path: 'coefficient',
      label: '%'
    },
    {
      path: 'lastname',
      label: 'Propietario'
    },
    {
      path: 'debtA',
      label: 'Deuda'
    },
    {
      path: 'typeA',
      label: 'Expensas'
    },
    {
      path: 'intA',
      label: 'Interes'
    },
    {
      path: 'debtB',
      label: 'Deuda'
    },
    {
      path: 'typeB',
      label: 'Expensas'
    },
    {
      path: 'intB',
      label: 'Interes'
    },
    {
      path: 'total',
      label: 'Total'
    },
    {
      path: 'isOpen',
      label: 'Pagado'
    }
  ];

  handleExpensesSort = sortExpenses => {
    this.setState({ sortExpenses });
  };
  handlePayingSort = sortPaying => {
    this.setState({ sortPaying });
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

  renderListStats(label, data) {
    return (
      <React.Fragment>
        <div className="border border-info p-3 mb-3 mx-auto rounded shadow bg-white">
          <p className="text-muted">{label}</p>
          <ul className="list-group">
            {data.map((i, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {i.label}
                <span
                  className={`badge badge-${
                    i.value < 0 ? 'danger' : 'primary'
                  } badge-pill`}
                >
                  {`$${i.value.toFixed(2)}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { expenses, period, sortExpenses, sortPeriod } = this.state;

    const sortedExpenses = this.getSortedData(expenses, sortExpenses);
    // const sortedPeriod = this.getSortedData(period, sortPeriod);

    return (
      <React.Fragment>
        <div className="row">
          <div className="col">{this.renderDateControls()}</div>
        </div>
        <div className="row">
          <div className="col">
            {/* {this.renderTable(
              'Liquidación',
              sortedPeriod,
              this.columnsPeriod,
              sortPeriod,
              this.handlePeriodSort
            )} */}
          </div>
        </div>
        <div className="row">
          <div className="col">
            {this.renderListStats('Expensas Ordinarias', [
              { label: 'Saldo Ordinarias', value: -10 },
              { label: 'Recaudación del mes', value: 232 },
              { label: 'Erogaciones', value: 232 },
              { label: 'Nuevo Saldo', value: 232 }
            ])}
            {this.renderListStats('Expensas Extraordinarias', [
              { label: 'Saldo Extraordinarias', value: -10 },
              { label: 'Recaudación del mes', value: 232 },
              { label: 'Erogaciones', value: 232 },
              { label: 'Nuevo Saldo', value: 232 }
            ])}
          </div>
          <div className="col">
            {this.renderTable(
              'Gastos',
              sortedExpenses,
              this.columnsExpenses,
              sortExpenses,
              this.handleExpensesSort
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Periods;
