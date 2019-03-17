import React from 'react';
import Joi from 'joi-browser';
import Form from './common/Form';
import PeriodSelector from './common/PeriodSelector';
import PeriodStats from './common/PeriodStats';
import { getPeriod, savePeriod } from '../services/periodsService';
import { getTotalPayments } from '../services/paymentsService';
import { getTotalExpenses } from '../services/expensesService';
import auth from '../services/authService';
import { getCurrentPeriod } from '../utils/dates';
import { toast } from 'react-toastify';

class PeriodsForm extends Form {
  state = {
    data: {
      period: '',
      userId: '',
      totalA: 0,
      totalB: 0,
      totalIncome: 0,
      isClosed: false
    },
    year: getCurrentPeriod().year,
    month: getCurrentPeriod().month,
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    period: Joi.string()
      .required()
      .label('Periodo'),
    userId: Joi.string()
      .required()
      .label('Usuario'),
    totalA: Joi.number()
      .required()
      .label('Total Expensas A'),
    totalB: Joi.number()
      .required()
      .label('Total Expensas B'),
    totalIncome: Joi.number()
      .required()
      .label('Total Income'),
    isClosed: Joi.boolean().label('Cerrado')
  };

  async populatePeriod() {
    try {
      const periodId = this.props.match.params.id;
      if (periodId === 'new') {
        const { data: newPeriod } = this.state;
        const currentPeriod = `${getCurrentPeriod().month} ${
          getCurrentPeriod().year
        }`;
        const { total: totalIncome } = getTotalPayments(currentPeriod);
        newPeriod.userId = auth.getCurrentUser()._id;
        newPeriod.period = currentPeriod;
        newPeriod.data.totalIncome = totalIncome;

        this.setState({ data: newPeriod });

        return;
      }
      const { data: period } = await getPeriod(periodId);
      this.setState({ data: this.mapToViewModel(period) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast(ex.response.data);
        return this.props.history.replace('/not-found');
      }
    }
  }

  async componentDidMount() {
    await this.populatePeriod();
  }

  mapToViewModel(p) {
    return {
      _id: p._id,
      period: p.period,
      userId: p.userdId,
      totalA: p.totalA,
      totalB: p.totalB,
      totalIncome: p.totalIncome,
      isClosed: p.isClosed
    };
  }

  doSubmit = async () => {
    const period = { ...this.state.data };

    try {
      await savePeriod(period);
    } catch (ex) {
      toast(ex.response.data);
      console.log(ex.response.data);
    }

    const { history } = this.props;
    history.push('/periods');
  };

  handleChangePeriod = async ({ currentTarget: input }) => {
    const newState = this.state;
    newState[input.id] = input.value;

    newState.data.period = `${newState.month} ${newState.year}`;

    const { total: totalIncome } = await getTotalPayments(newState.data.period);
    newState.data.totalIncome = totalIncome;

    //refactorear carga de datos, que los select se actualizen, eliminar codigo dupiclado

    const expenses = await getTotalExpenses(newState.data.period);
    newState.data.totalA = expenses.filter(e => e._id !== 'A')[0].total;
    newState.data.totalB = expenses.filter(e => e._id !== 'B')[0].total;

    this.setState({ ...newState });
  };

  render() {
    const { totalA, totalB, totalIncome } = this.state.data;
    const { year, month } = this.state;
    console.log(this.state);
    return (
      <React.Fragment>
        <div className="border border-info rounded shadow-sm p-3 mt-5 bg-white adjust">
          <form onSubmit={this.handleSubmit}>
            <PeriodSelector
              months={month}
              years={year}
              handlePeriod={this.handleChangePeriod}
            />
            <PeriodStats
              totalA={totalA}
              totalB={totalB}
              totalIncome={totalIncome}
            />
            <div className="row justify-content-around">
              <div className="col mb-2">
                {this.renderCheck('isClosed', 'Periodo Cerrado')}
              </div>
            </div>
            <div className="row">{this.renderButton('Guardar')}</div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default PeriodsForm;
