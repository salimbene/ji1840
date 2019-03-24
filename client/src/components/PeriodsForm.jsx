import React from 'react';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';
import Form from './common/Form';
import SimpleModal from './common/SimpleModal';
import PeriodSelector from './common/PeriodSelector';
import PeriodStats from './common/PeriodStats';
import PeriodsDTable from './PeriodsDTable';
import { getPeriod, savePeriod } from '../services/periodsService';
import { getTotalPayments } from '../services/paymentsService';
import { getTotalExpenses } from '../services/expensesService';
import { getPDetailsByPeriod, savePDetails } from '../services/pdetailsService';
import auth from '../services/authService';
import { getCurrentPeriod, getLastXMonths } from '../utils/dates';

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
      year: getCurrentPeriod(1).year,
      month: getCurrentPeriod(1).month,
      errors: {}
    };
    this.toggleRegister = this.toggleRegister.bind(this);
    this.togglePeriod = this.togglePeriod.bind(this);
  }

  togglePeriod() {
    this.setState(prevState => ({ modal: !prevState.modal }));
  }

  toggleRegister(detail) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      selectedDetail: detail
    }));
  }

  handleRegister = async () => {
    const { selectedDetail } = this.state;
    // console.log('handleRegister');
    // const periods = this.state.periods.filter(
    //   u => u._id !== selectedDetail._id
    // );

    // this.setState({ periods });

    try {
      const details = this.MapToMongoModel(selectedDetail);
      const res = await savePDetails(details);
      console.log(res);
    } catch (ex) {
      console.log('ex', ex);
      if (ex.response && ex.response.status === 404) {
        toast(ex.response.data);
      }
    }
    this.toggleRegister();
  };

  MapToMongoModel(details) {
    //DEpopulate model & userId
    details.userId = details.userId._id;
    details.model = details.model._id;
    details.isPayed = true;
    return details;
  }

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

  doSubmit = () => {
    this.togglePeriod();
  };

  handleSavePeriod = async () => {
    const period = { ...this.state.data };
    period.isClosed = true;
    try {
      console.log(period);
      await savePeriod(period);
    } catch (ex) {
      toast(ex.response.data);
      console.log(ex.response.data);
    }
    this.togglePeriod();
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

  ModalPeriodBody = data => {
    const { _id, period } = data;
    const bodyPeriod = (
      <p className="lead">
        Se cerrará el periodo <mark>{period}</mark>. Los usuarios que no hayan
        registrado pagos en el período se registrarán como deudores.
      </p>
    );
    const bodyNewPeriod = (
      <p className="lead">
        Se iniciará el periodo <mark>{period}</mark>.
      </p>
    );

    return _id ? bodyPeriod : bodyNewPeriod;
  };

  ModalBodyDetail = user => {
    const { lastname, balance } = user;
    return (
      <p className="lead">
        El usuario <mark>{lastname}</mark> posee{' '}
        <mark>${Number(balance).toFixed(2)}</mark>
        en su cuenta. Si confirma la operación se debitará el pago de su cuenta.
      </p>
    );
  };

  render() {
    const { year, month, details, modal, selectedDetail, data } = this.state;
    const { totalA, totalB, totalIncome, _id } = data;
    const saveButtonLabel = !_id ? 'Iniciar Período' : 'Cerrar Período';

    return (
      <React.Fragment>
        <SimpleModal
          isOpen={modal}
          toggle={this.togglePeriod}
          title={saveButtonLabel}
          label={saveButtonLabel}
          action={this.handleSavePeriod}
          body={this.ModalPeriodBody(data)}
        />
        {selectedDetail && selectedDetail.model && (
          <SimpleModal
            isOpen={modal}
            toggle={this.toggleRegister}
            title="Registrar pago"
            label="Confirmar"
            action={this.handleRegister}
            body={this.ModalBodyDetail(selectedDetail.model.userId)}
          />
        )}
        <div className="border border-info rounded shadow-sm p-3 mt-1 bg-white adjust">
          <form onSubmit={this.handleSubmit}>
            <div className="row align-items-end">
              <div className="col">
                {this.renderSelect('period', 'Mes', '', getLastXMonths(12, 1))}
              </div>
              <div className="col">
                <div className="row">{this.renderButton(saveButtonLabel)}</div>
              </div>
            </div>

            <PeriodStats
              totalA={totalA}
              totalB={totalB}
              totalIncome={totalIncome}
            />
          </form>
        </div>
        {/* {details && this.renderDetails(details)} */}
      </React.Fragment>
    );
  }
}

export default PeriodsForm;
