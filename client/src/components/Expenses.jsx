import React, { Component } from 'react';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import ExpensesTable from './ExpensesTable';
import ExpensesForm from './ExpensesForm';
import { paginate } from '../utils/paginate';
import { ToastContainer, toast } from 'react-toastify';
import { getExpenses, deleteExpense } from '../services/expensesService';
import auth from '../services/authService';
import 'react-toastify/dist/ReactToastify.css';

class Expenses extends Component {
  state = {
    expenses: {},
    pageSize: 10,
    currentPage: 1,
    searchQuery: '',
    sortColumn: { path: 'lastname', order: 'asc' }
  };

  async componentDidMount() {
    // const { data } = await getGenres();
    // const genres = [{ _id: "", name: "All Genres" }, ...data];
    // const { data: expenses } = await getExpenses();
    // this.setState({ expenses, user: auth.getCurrentUser() });
    console.log('expenses did mount');
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
    history.push('/register');
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selected: null, currentPage: 1 });
  };

  getPageData = () => {
    const {
      expenses: allExpenses,
      pageSize,
      currentPage,
      selected,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allExpenses;

    if (searchQuery)
      filtered = allExpenses.filter(u =>
        u.lastname.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selected && selected.id)
      filtered = allExpenses.filter(u => u.floor === selected.id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const users = paginate(sorted, currentPage, pageSize);

    return {
      totalCount: filtered.length || 0,
      data: users
    };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.state;

    const { totalCount, data: expenses } = this.getPageData();

    return (
      <div className="row units">
        <div className="col">
          <ToastContainer />
          <ExpensesForm />
          <p>Gastos registrados: {totalCount}</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          {/* <ExpensesTable
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
          )} */}
        </div>
      </div>
    );
  }
}

export default Expenses;
