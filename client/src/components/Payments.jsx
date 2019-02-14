import React, { Component } from 'react';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import Select from './common/Select';
import PaymentsTable from './PaymentsTable';
import auth from '../services/authService';
import { getPayments, deletePayment } from '../services/paymentsService';
import { getLastXYears, getCurrentPeriod, monthLabels } from '../utils/dates';
import { paginate } from '../utils/paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Payments extends Component {
  state = {
    payments: {},
    pageSize: 10,
    currentPage: 1,
    searchQuery: '',
    selectedPeriod: null,
    sortColumn: { path: 'type', order: 'asc' },
    year: getCurrentPeriod().year,
    month: getCurrentPeriod().month
  };

  async componentDidMount() {
    const { data: payments } = await getPayments();
    this.setState({ payments, user: auth.getCurrentUser() });
  }

  handleDelete = payment => {
    const rollback = this.state.payments;
    const payments = this.state.payments.filter(u => u._id !== payment._id);
    this.setState({ payments });

    try {
      deletePayment(payment._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast('Something failed!');
        this.setState({ payments: rollback });
      }
    }
  };

  handlePeriodSelect = event => {
    let { year, month } = this.state;
    if (event.target.name === 'year') year = event.target.value;
    if (event.target.name === 'month') month = event.target.value;

    this.setState({
      selectedPeriod: `${month} ${year}`,
      searchQuery: '',
      currentPage: 1,
      year,
      month
    });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleAddUnit = () => {
    const { history } = this.props;
    history.push('/payments/new');
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedPeriod: null, currentPage: 1 });
  };

  getPageData = () => {
    const {
      payments: allPayments,
      pageSize,
      currentPage,
      sortColumn,

      selectedPeriod,
      searchQuery
    } = this.state;

    let filtered = allPayments;

    if (searchQuery) {
      filtered = allPayments.filter(u =>
        u.comments.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    } else if (selectedPeriod)
      filtered = allPayments.filter(m => m.period === selectedPeriod);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const payments = paginate(sorted, currentPage, pageSize);

    return {
      totalCount: filtered.length || 0,
      data: payments
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

    const { totalCount, data: payments } = this.getPageData();

    return (
      <React.Fragment>
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
        <div className="row units">
          <div className="col">
            <ToastContainer />
            <p>Unidades registradas: {totalCount}</p>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <PaymentsTable
              payments={payments}
              onDelete={this.handleDelete}
              onSort={this.handleSort}
              sortColumn={sortColumn}
            />

            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
            {user && (
              <button
                onClick={event => this.handleAddUnit(event)}
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

export default Payments;
