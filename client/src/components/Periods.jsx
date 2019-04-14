import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import SimpleModal from './common/SimpleModal';
import CarbonTableTitle from './common/CarbonTableTitle';
import CarbonTablePagination from './common/CarbonTablePagination';
import CarbonModal from './common/CarbonModal';
import auth from '../services/authService';
import PeriodsTable from './PeriodsTable';
import {
  getPeriods,
  deletePeriod,
  savePeriod
} from '../services/periodsService.js';
import { paginate } from '../utils/paginate';
import { getLastXMonths, getLastPeriod } from '../utils/dates';
import Select from './common/Select';

class Periods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      periods: [],
      pageSize: 10,
      currentPage: 1,
      searchQuery: '',
      delModal: false,
      newModal: false,
      clsModal: false,
      sortColumn: { path: 'date', order: 'dec' },
      period: getLastPeriod(new Date())
    };

    this.toggleDelete = this.toggleDelete.bind(this);
    this.toggleNewPeriod = this.toggleNewPeriod.bind(this);
    this.toggleClsPeriod = this.toggleClsPeriod.bind(this);
  }

  toggleDelete(period) {
    this.setState(prevState => ({
      delModal: !prevState.delModal,
      selectedPeriod: period
    }));
  }

  toggleNewPeriod() {
    this.setState(prevState => ({
      newModal: !prevState.newModal
    }));
  }

  toggleClsPeriod(period) {
    this.setState(prevState => ({
      clsModal: !prevState.clsModal,
      selectedPeriod: period
    }));
  }

  async componentDidMount() {
    const { data: periods } = await getPeriods();

    this.setState({ periods, currentUser: auth.getCurrentUser() });
  }

  handleDelete = period => {
    const { selectedPeriod } = this.state;
    const { periods: rollback } = this.state;

    const periods = this.state.periods.filter(
      u => u._id !== selectedPeriod._id
    );

    this.setState({ periods });

    try {
      deletePeriod(selectedPeriod._id);
    } catch (ex) {
      this.setState({ expenses: rollback });
    }
    this.toggleDelete();
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleNewPeriod = () => {
    const { period, periods } = this.state;

    if (periods.find(p => p.period === period)) {
      toast.error(`⚠️ El período ya ha sido iniciado.`);
      this.toggleNewPeriod();
      return;
    }

    this.toggleNewPeriod();
    const { history } = this.props;
    history.push(`/periods/new/${period}`);
  };

  handleClsPeriod = async () => {
    const { periods: rollback } = this.state;
    const { selectedPeriod, periods } = this.state;

    try {
      const period = this.mapToMongoModel({ ...selectedPeriod });
      const item = periods.find(d => d._id === period._id);

      if (item.isClosed)
        throw new Error('⚠️ Un período cerrado no puede reabrirse.');

      item.isClosed = !item.isClosed;
      period.isClosed = item.isClosed;
      await savePeriod(period);
    } catch (ex) {
      toast.error(ex.message);
      this.setState({ periods: rollback });
    }
    this.toggleClsPeriod(selectedPeriod);
  };

  mapToMongoModel(period) {
    //DEpopulate userId
    delete period.date;
    delete period.__v;
    delete period.balanceA;
    delete period.balanceB;
    delete period.balance;
    period.userId = period.userId._id;
    return period;
  }

  handlePageSize = event => {
    this.setState({ pageSize: event.target.value });
  };

  handlePageChange = (page, arrow, pagesCount) => {
    const { value } = page.target;
    let { currentPage } = this.state;

    currentPage = value ? Number(value) : (currentPage += arrow);
    if (currentPage < 1) currentPage = 1;
    if (currentPage > pagesCount) currentPage = pagesCount;

    this.setState({ currentPage });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  getPageData = () => {
    const {
      periods: allPeriods,
      pageSize,
      currentPage,
      sortColumn,
      searchQuery
    } = this.state;

    if (!allPeriods) return;

    let filtered = allPeriods;

    filtered.map((period, ind) => {
      period.balanceA = period.incomeA - period.expensesA;
      period.balanceB = period.incomeB - period.expensesB;
      period.balance = period.balanceA + period.balanceB;
    });

    if (searchQuery) {
      filtered = allPeriods.filter(u =>
        u.period.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const periods = paginate(sorted, currentPage, pageSize);
    return {
      totalCount: filtered.length || 0,
      data: periods
    };
  };

  handleChange = ({ currentTarget: input }) => {
    this.setState({ period: input.value });
  };

  modalBodyNew = period => {
    return (
      <Fragment>
        <p className="lead">Se dará inicio al período indicado:</p>
        <Select
          name={period}
          value={period}
          label="Período"
          options={getLastXMonths(12, 1)}
          onChange={this.handleChange}
        />
      </Fragment>
    );
  };

  modalPropsNew = () => {
    const { period, newModal } = this.state;
    return {
      isOpen: newModal,
      title: 'Inicio de período',
      label: 'Consortia - Jose Ingenieros 1840',
      body: this.modalBodyNew(period),
      cancelBtnLabel: 'Cancelar',
      submitBtnLabel: 'Iniciar',
      toggle: this.toggleNewPeriod,
      submit: this.handleNewPeriod
    };
  };

  modalBodyDel = period => {
    return <p className="lead">Se eliminará el período {period}</p>;
  };

  modalPropsDel = () => {
    const { period, delModal } = this.state;
    return {
      isOpen: delModal,
      title: 'Eliminar período',
      label: 'Consortia - Jose Ingenieros 1840',
      body: this.modalBodyDel(period),
      cancelBtnLabel: 'Cancelar',
      submitBtnLabel: 'Eliminar',
      toggle: this.toggleDelete,
      submit: this.handleDelete,
      danger: true
    };
  };

  modalBodyClose = period => {
    return (
      <p className="lead">
        Se cerrará el periodo <mark>{period}</mark>. De existir alguna expensa
        sin pagar se registará la deuda correspondiente, y se actualizarán los
        saldos del consorcio.
      </p>
    );
  };

  modalPropsClose = () => {
    const { period, clsModal } = this.state;
    return {
      isOpen: clsModal,
      title: 'Cerrar período',
      label: 'Consortia - Jose Ingenieros 1840',
      body: this.modalBodyClose(period),
      cancelBtnLabel: 'Cerrar',
      submitBtnLabel: 'Eliminar',
      toggle: this.toggleClsPeriod,
      submit: this.handleClsPeriod,
      danger: true
    };
  };

  render() {
    const { user } = this.state;
    if (user && !user.isAdmin)
      return (
        <div className="alert alert-danger" role="alert">
          Acceso no autorizado.
        </div>
      );

    const { period, currentUser } = this.state;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { totalCount, data: periods } = this.getPageData();

    return (
      <Fragment>
        <CarbonModal {...this.modalPropsNew()} />
        <CarbonModal {...this.modalPropsDel()} />
        <CarbonModal {...this.modalPropsClose()} />
        <div className="bx--row">
          <div className="bx--col">
            <CarbonTableTitle
              title="Expensas"
              helper="Lista de liquidaciones de expensas registradas."
              btnLabel="Iniciar período"
              btnClick={this.toggleNewPeriod}
              currentUser={currentUser}
            />
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <PeriodsTable
              periods={periods}
              onDelete={this.toggleDelete}
              onClosePeriod={this.toggleClsPeriod}
              onSort={this.handleSort}
              sortColumn={sortColumn}
            />
            <CarbonTablePagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageSize={this.handlePageSize}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Periods;
