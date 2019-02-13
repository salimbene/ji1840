import React, { Component } from 'react';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import ExpensesTable from './ExpensesTable';
import auth from '../services/authService';
import { getExpenses, deleteExpense } from '../services/expensesService';
import { paginate } from '../utils/paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Expenses extends Component {
  state = {
    expenses: {},
    pageSize: 10,
    currentPage: 1,
    searchQuery: '',
    sortColumn: { path: 'type', order: 'asc' }
  };

  async componentDidMount() {
    const { data: expenses } = await getExpenses();
    this.setState({ expenses, user: auth.getCurrentUser() });
  }

  handleDelete = expense => {
    const rollback = this.state.expenses;
    const expenses = this.state.expenses.filter(u => u._id !== expense._id);
    this.setState({ expenses });

    try {
      deleteExpense(expense._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast('Something failed!');
        this.setState({ expenses: rollback });
      }
    }
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleAddUnit = () => {
    const { history } = this.props;
    history.push('/expenses/new');
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  getPageData = () => {
    const {
      expenses: allExpenses,
      pageSize,
      currentPage,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allExpenses;

    if (searchQuery) {
      filtered = allExpenses.filter(u =>
        u.landlord.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const expenses = paginate(sorted, currentPage, pageSize);

    return {
      totalCount: filtered.length || 0,
      data: expenses
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

    const { totalCount, data: expenses } = this.getPageData();

    return (
      <div className="row units">
        <div className="col">
          <ToastContainer />
          <p>Unidades registradas: {totalCount}</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <ExpensesTable
            expenses={expenses}
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

export default Expenses;
