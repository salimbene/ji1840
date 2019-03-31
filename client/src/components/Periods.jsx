import React, { Component } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import SimpleModal from './common/SimpleModal';
import auth from '../services/authService';
import PeriodsTable from './PeriodsTable';
import { getPeriods, deletePeriod } from '../services/periodsService.js';
import { paginate } from '../utils/paginate';
import { getLastXMonths, getLastPeriod } from '../utils/dates';
import Select from './common/Select';

class Periods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      periods: {},
      pageSize: 10,
      currentPage: 1,
      searchQuery: '',
      delModal: false,
      newModal: false,
      sortColumn: { path: 'date', order: 'dec' },
      period: getLastPeriod(new Date())
    };

    this.toggleDelete = this.toggleDelete.bind(this);
    this.toggleNewPeriod = this.toggleNewPeriod.bind(this);
  }

  toggleDelete(model) {
    this.setState(prevState => ({
      delModal: !prevState.delModal,
      selectedPeriod: model
    }));
  }

  toggleNewPeriod() {
    this.setState(prevState => ({
      newModal: !prevState.newModal
    }));
  }

  async componentDidMount() {
    const { data: periods } = await getPeriods();
    this.setState({ periods, user: auth.getCurrentUser() });
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
      toast.error(`☹️ Error: ${ex.response.data}`);
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

  handlePageChange = page => {
    this.setState({ currentPage: page });
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

    let filtered = allPeriods;

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

  newPeriodModalBody = period => {
    return (
      <p className="lead">
        Se iniciará el periodo <mark>{period}</mark>.
      </p>
    );
  };

  render() {
    const { user } = this.state;
    if (user && !user.isAdmin)
      return (
        <div className="alert alert-danger" role="alert">
          Acceso no autorizado.
        </div>
      );

    const {
      delModal,
      newModal,
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      period
    } = this.state;

    const { totalCount, data: periods } = this.getPageData();

    return (
      <React.Fragment>
        <SimpleModal
          isOpen={newModal}
          toggle={this.toggleNewPeriod}
          title={'Iniciar nuevo período'}
          label={'Confirmar'}
          action={this.handleNewPeriod}
          body={this.newPeriodModalBody(period)}
        />
        <SimpleModal
          isOpen={delModal}
          toggle={this.toggleDelete}
          title="Eliminar periodo"
          label="Eliminar"
          action={this.handleDelete}
        />
        <div className="row units">
          <div className="col">
            <p>Períodos registrados: {totalCount}</p>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            {totalCount ? (
              <React.Fragment>
                <PeriodsTable
                  periods={periods}
                  onDelete={this.toggleDelete}
                  onSort={this.handleSort}
                  sortColumn={sortColumn}
                />
                <Pagination
                  itemsCount={totalCount}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={this.handlePageChange}
                />
              </React.Fragment>
            ) : (
              ''
            )}
            {user && (
              <React.Fragment>
                <div className="border border-info rounded shadow-sm p-3 mt-1 bg-white adjust">
                  <div className="row align-items-end">
                    <div className="col">
                      <Select
                        name={period}
                        value={period}
                        label="Período"
                        options={getLastXMonths(12, 1)}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="col m-1">
                      <button
                        onClick={event => this.toggleNewPeriod()}
                        className="btn btn-primary btn-sm"
                        type="button"
                      >
                        Iniciar nuevo período
                      </button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Periods;
