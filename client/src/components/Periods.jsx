import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import SimpleModal from './common/SimpleModal';
import auth from '../services/authService';
import PeriodsTable from './PeriodsTable';
import { getPeriods, deletePeriod } from '../services/periodsService.js';
import { paginate } from '../utils/paginate';
import 'react-toastify/dist/ReactToastify.css';

class Periods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      periods: {},
      pageSize: 10,
      currentPage: 1,
      searchQuery: '',
      modal: false,
      sortColumn: { path: 'date', order: 'dec' }
    };

    this.toggleDelete = this.toggleDelete.bind(this);
  }

  toggleDelete(model) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      selectedPeriod: model
    }));
  }

  async componentDidMount() {
    const { data: periods } = await getPeriods();
    console.log(periods);
    this.setState({ periods, user: auth.getCurrentUser() });
  }

  handleDelete = period => {
    const { selectedPeriod } = this.state;
    const { periods: rollback } = this.state;

    // const periods = this.state.periods.filter(
    //   u => u._id !== selectedPeriod._id
    // );

    // this.setState({ periods });

    try {
      console.log(selectedPeriod);
      // deleteModel(selectedPeriod._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast(ex.response.data);
        this.setState({ models: rollback });
      }
    }
    this.toggleDelete();
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleAddPeriod = () => {
    const { history } = this.props;
    history.push('/periods/new');
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

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.state;

    if (user && !user.isAdmin)
      return (
        <div className="alert alert-danger" role="alert">
          Acceso no autorizado.
        </div>
      );

    const { totalCount, data: periods } = this.getPageData();

    return (
      <React.Fragment>
        <ToastContainer />
        <SimpleModal
          isOpen={this.state.modal}
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
              <button
                onClick={event => this.handleAddPeriod(event)}
                className="btn btn-primary btn-sm"
                style={{ marginBottom: 20 }}
              >
                Nuevo
              </button>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Periods;
