import React, { Component } from 'react';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import PaymentsTable from './PaymentsTable';
import auth from '../services/authService';
import { getPayments, deletePayment } from '../services/paymentsService';
import { paginate } from '../utils/paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Payments extends Component {
  state = {
    payments: {},
    pageSize: 10,
    currentPage: 1,
    searchQuery: '',
    sortColumn: { path: 'type', order: 'asc' }
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
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  getPageData = () => {
    const {
      payments: allPayments,
      pageSize,
      currentPage,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allPayments;

    if (searchQuery) {
      filtered = allPayments.filter(u =>
        u.userId.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

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
    );
  }
}

export default Payments;
