import React from 'react';
import Joi from 'joi-browser';
import { ToastContainer, toast } from 'react-toastify';
import Form from './common/Form';
import SimpleModal from './common/SimpleModal';
import PeriodSelector from './common/PeriodSelector';
import PeriodStats from './common/PeriodStats';
import PeriodsDTable from './PeriodsDTable';
import { getPeriod, savePeriod } from '../services/periodsService';
import { getTotalPayments } from '../services/paymentsService';
import { getTotalExpenses } from '../services/expensesService';
import { getPDetailsByPeriod } from '../services/pdetailsService';
import auth from '../services/authService';
import { getCurrentPeriod } from '../utils/dates';

class PeriodsForm extends Form {
  constructor(props) {
    super(props);
    this.state = {
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
    this.toggleRegister = this.toggleRegister.bind(this);
  }

  toggleRegister(detail) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      selectedDetail: detail
    }));
  }

  handleRegister = detail => {
    const { selectedDetail } = this.state;
    const { details: rollback } = this.state;

    // const periods = this.state.periods.filter(
    //   u => u._id !== selectedDetail._id
    // );

    // this.setState({ periods });

    try {
      console.log('selectedDetail', selectedDetail);
      // deleteModel(selectedDetail._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast(ex.response.data);
        this.setState({ details: rollback });
      }
    }
    this.toggleRegister();
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
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
        const newState = this.state;

        newState.data.userId = auth.getCurrentUser()._id;
        newState.data.period = `${newState.month} ${newState.year}`;

        const { total: totalIncome } = await getTotalPayments(
          newState.data.period
        );
        newState.data.totalIncome = totalIncome;

        const { totalA, totalB } = await getTotalExpenses(newState.data.period);
        newState.data.totalA = totalA;
        newState.data.totalB = totalB;

        this.setState({ ...newState });

        return;
      }

      const { data: period } = await getPeriod(periodId);

      const month = period.period.split(' ')[0];
      const year = period.period.split(' ')[1];

      this.setState({
        month,
        year,
        data: this.mapToViewModel(period)
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast(ex.response.data);
        return this.props.history.replace('/not-found');
      }
    }
  }

  async populateDetails(period) {
    try {
      const details = await getPDetailsByPeriod(period);
      this.setState({ details });
      console.log(this.state);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast(ex.response.data);
        return this.props.history.replace('/not-found');
      }
    }
  }

  async componentDidMount() {
    await this.populatePeriod();
    const { period } = this.state.data;
    await this.populateDetails(period);
  }

  mapToViewModel(p) {
    return {
      _id: p._id,
      period: p.period,
      userId: p.userId._id,
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

    const { totalA, totalB } = await getTotalExpenses(newState.data.period);

    newState.data.totalA = totalA;
    newState.data.totalB = totalB;

    this.setState({ ...newState });
  };

  renderDetails = details => {
    const { data } = details;
    const sortColumn = { path: 'fUnit', order: 'asc' };

    return (
      <React.Fragment>
        <div className="border border-info rounded shadow-sm p-3 mt-5 bg-white adjust">
          <PeriodsDTable
            data={data}
            onRegister={this.toggleRegister}
            onSort={this.handleSort}
            sortColumn={sortColumn}
          />
        </div>
      </React.Fragment>
    );
  };

  render() {
    const { totalA, totalB, totalIncome } = this.state.data;
    const { year, month, details, modal, selectedDetail } = this.state;
    return (
      <React.Fragment>
        <ToastContainer />
        <SimpleModal
          isOpen={modal}
          toggle={this.toggleRegister}
          title="Registar pago"
          label="Confirmar"
          action={this.handleRegister}
          formData={
            selectedDetail &&
            selectedDetail.model &&
            selectedDetail.model.fUnits
          }
        />
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
        {details && this.renderDetails(details)}
      </React.Fragment>
    );
  }
}

export default PeriodsForm;
