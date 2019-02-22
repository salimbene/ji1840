import React, { Component } from 'react';
import _ from 'lodash';
import Table from './common/Table';
import Select from './common/Select';
import { getCurrentPeriod, formatDate } from '../utils/dates';
import { getExpenses } from '../services/expensesService';
import { getLandlords } from '../services/usersService';
import { getUnitsOwnedBy } from '../services/unitsService';
import { savePDetails, getPDetailsByPeriod } from '../services/pdetailsService';

class Periods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      users: [],
      expenses: [],
      pdetails: [],
      sortExpenses: { path: 'date', order: 'dec' },
      sortPDetails: { path: 'userId', order: 'dec' },
      currentPeriod: `${getCurrentPeriod().month} ${getCurrentPeriod().year}`
    };
    this.openPeriod = this.openPeriod.bind(this);
  }

  async populatePeriod() {
    const { currentPeriod } = this.state;
    const { data: pdetails } = await getPDetailsByPeriod(currentPeriod);
    console.log('popu period', pdetails);
    this.setState(prevState => ({ pdetails }));
  }
  async populateExpenses() {
    const { currentPeriod } = this.state;
    const { data: expenses } = await getExpenses(currentPeriod);
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

    console.log('populandlord', data);
  }

  componentDidMount() {
    this.populateExpenses();
    this.populateLandlords();
    this.populatePeriod();
  }

  async openPeriod(typeA = 30000, typeB = 1500, intA = 0, intB = 0) {
    const { data: landlords } = await getLandlords();
    const { currentPeriod } = this.state;
    const pDetails = [];
    // const {data} = await newPeriod()

    const data = {
      period: currentPeriod,
      userId: '',
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
      console.log('map', data.userId);
      const { data: ownedUnits } = await getUnitsOwnedBy(user._id);
      const coefficient =
        ownedUnits.reduce((a, c) => a + c.coefficient, 0) * 100;
      data.coefficient = coefficient;
      data.debtA = 0; //fetch
      data.expenseA = (coefficient * 30000) / 100;
      data.interestA = data.debtB = 0; // calc //fetch
      data.expenseB = typeB;
      data.interestB = 0; //calc

      console.log('try', data.userId);
      try {
        // const { data: pdetails } = await savePDetails(data);
        pDetails.push(data);
      } catch (ex) {
        console.log(ex.response.data);
      }
    });

    console.log('pDetails', pDetails);
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

  // {
  //   period: Joi.string().required(),
  //   userId: Joi.ObjectId().required(),
  //   coefficient: Joi.number().required(),
  //   debtA: Joi.number().required(),
  //   expenseA: Joi.number().required(),
  //   interestA: Joi.number().required(),
  //   debtB: Joi.number().required(),
  //   expenseB: Joi.number().required(),
  //   interestB: Joi.number().required(),
  //   isSettledA: Joi.boolean().required(),
  //   isSettledB: Joi.boolean().required()
  // }

  columnPDetails = [
    {
      path: 'userId',
      label: 'Usuario',
      content: user => <p>{user.userId.lastname}</p>
    },
    {
      path: 'coefficient',
      label: '%',
      content: v => `${v.coefficient.toFixed(3)}`
    },
    {
      path: 'debtA',
      label: 'Deuda',
      content: v => `$${v.debtA.toFixed(2)}`
    },
    {
      path: 'expenseA',
      label: 'Ordinarias',
      content: v => `$${v.expenseA.toFixed(2)}`
    },
    {
      path: 'interestA',
      label: 'Int. x Mora',
      content: v => `$${v.interestA.toFixed(2)}`
    },
    {
      path: 'isSettledA',
      label: '¿Pago A?'
    },
    {
      path: 'debtB',
      label: 'Deuda',
      content: v => `$${v.debtB.toFixed(2)}`
    },
    {
      path: 'expenseB',
      label: 'Extra.',
      content: v => `$${v.expenseB.toFixed(2)}`
    },
    {
      path: 'interestB',
      label: 'Int. x Mora',
      content: v => `$${v.interestB.toFixed(2)}`
    },
    {
      path: 'isSettledB',
      label: '¿Pago B?'
    },
    {
      path: 'total',
      label: 'Total'
    }
  ];

  handleExpensesSort = sortExpenses => {
    this.setState({ sortExpenses });
  };

  handlePayingSort = sortPaying => {
    this.setState({ sortPaying });
  };

  handlePDetailsSort = sortPDetails => {
    this.setState({ sortPDetails });
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
    const { expenses, pdetails, sortExpenses, sortPDetails } = this.state;

    const sortedExpenses = this.getSortedData(expenses, sortExpenses);
    const sortedPDetails = this.getSortedData(pdetails, sortPDetails);

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
          </div>
          <div className="col">
            {this.renderListStats('Expensas Extraordinarias', [
              { label: 'Saldo Extraordinarias', value: -10 },
              { label: 'Recaudación del mes', value: 232 },
              { label: 'Erogaciones', value: 232 },
              { label: 'Nuevo Saldo', value: 232 }
            ])}
          </div>
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
        </div>
        <div className="row">
          <div className="col">
            {this.renderTable(
              'Expensas',
              sortedPDetails,
              this.columnPDetails,
              sortPDetails,
              this.handlePDetailsSort
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Periods;
