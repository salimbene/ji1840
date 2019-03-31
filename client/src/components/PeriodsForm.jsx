import React from 'react';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';
import Form from './common/Form';
import SimpleModal from './common/SimpleModal';
import PeriodStats from './common/PeriodStats';
import PeriodsDTable from './PeriodsDTable';
import { getPeriod, savePeriod, initPeriod } from '../services/periodsService';
import { getTotalPayments } from '../services/paymentsService';
import {
  getExpensesByPeriod,
  getTotalExpenses
} from '../services/expensesService';
import { getPDetailsByPeriod, savePDetails } from '../services/pdetailsService';
import auth from '../services/authService';
import { getCurrentPeriod, getLastXMonths } from '../utils/dates';
import ExpensesStats from './ExpensesStats';
import _ from 'lodash';

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
      sortColumn: { path: 'model', order: 'asc' },
      errors: {}
    };
    this.toggleRegister = this.toggleRegister.bind(this);
    this.togglePeriod = this.togglePeriod.bind(this);
  }

  async componentDidMount() {
    const { id, period: newPeriod } = this.props.match.params;

    if (newPeriod) {
      await this.newPeriod(newPeriod);
    } else {
      await this.populatePeriod(id);
    }

    const { period } = this.state.data;
    await this.populateDetails(period);

    await this.populateExpenses(period);
  }

  async populateExpenses(period) {
    const expenses = await getExpensesByPeriod(period);
    this.setState({ expenses });
  }

  async populateDetails(period) {
    const details = await getPDetailsByPeriod(period);
    this.setState({ details });
  }
  async populatePeriod(id) {
    const { data: period } = await getPeriod(id);
    this.setState({ data: this.mapToViewModel(period) });
    // return this.props.history.replace('/not-found');
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

    const details = this.MapToMongoModel(selectedDetail);
    const res = await savePDetails(details);
    console.log(res);

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

  newPeriod = async period => {
    const body = {
      period: period,
      userId: auth.getCurrentUser()._id,
      totalA: 0,
      totalB: 0,
      totalIncome: 0,
      isClosed: false
    };

    const newPeriod = await initPeriod(body);
    this.setState({ data: this.mapToViewModel(newPeriod) });
  };

  doSubmit = () => {
    this.togglePeriod();
  };

  handleSavePeriod = async () => {
    const period = { ...this.state.data };
    try {
      // period.isClosed = true;
      console.log(period);
      await savePeriod(period);
    } catch (ex) {
      console.log(ex.response.data);
    }
    this.togglePeriod();
    const { history } = this.props;
    history.push('/periods');
  };

  handleSortDetails = sortColumn => {
    this.setState({ sortColumn });
  };

  renderDetails = details => {
    const { data } = details;
    const { sortColumn } = this.state;
    const sorted = _.orderBy(data, [sortColumn.path], [sortColumn.order]);
    return (
      <React.Fragment>
        <div className="border border-info rounded shadow-sm p-3 mt-5 bg-white adjust">
          <PeriodsDTable
            data={sorted}
            onRegister={this.toggleRegister}
            onSort={this.handleSortDetails}
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
    const { details, expenses, modal, selectedDetail, data } = this.state;
    const { totalA, totalB, totalIncome, _id } = data;
    const saveButtonLabel = !_id ? 'Iniciar Período' : 'Cerrar Período';

    if (!details || !expenses) return 'No hay información disponible';

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
        <ExpensesStats expenses={expenses} />
        {this.renderDetails(details)}
      </React.Fragment>
    );
  }
}

export default PeriodsForm;

// {/* <PeriodStats
//   totalA={totalA}
//   totalB={totalB}
//   totalIncome={totalIncome}
// /> */}
// {/* {details && this.renderDetails(details)} */}
