import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import _ from 'lodash';
import ExpensesTable from './ExpensesTable';
import Pagination from './common/Pagination';
import auth from '../services/authService';
import { getExpenses, deleteExpense } from '../services/expensesService';
import { paginate } from '../utils/paginate';
import { getCurrentPeriod } from '../utils/dates';
import 'react-toastify/dist/ReactToastify.css';

class CurrentMonth extends Component {
  state = {
    expenses: {},
    pageSize: 15,
    currentPage: 1,
    searchQuery: '',
    selectedPeriod: null,
    sortColumn: { path: 'type', order: 'asc' },
    year: getCurrentPeriod().year,
    month: getCurrentPeriod().month
  };

  async componentDidMount() {
    //populate expenses of current month
    //populate payments of current month
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

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  getPageData = () => {
    const {
      expenses: allExpenses,
      pageSize,
      currentPage,
      sortColumn
    } = this.state;

    let filtered = allExpenses;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const expenses = paginate(sorted, currentPage, pageSize);

    return {
      totalCount: filtered.length || 0,
      data: expenses
    };
  };

  render() {
    const { pageSize, currentPage, sortColumn } = this.state;
    const { user } = this.state;

    if (user && !user.isAdmin)
      return (
        <div className="alert alert-danger" role="alert">
          Acceso no autorizado.
        </div>
      );

    const { totalCount, data: expenses } = this.getPageData();

    const period = `${getCurrentPeriod().month} ${getCurrentPeriod().year} `;
    return (
      <React.Fragment>
        <div className="row">
          <h3>
            {period}
            <small class="text-muted"> expensas</small>
          </h3>
        </div>
        <div className="row">
          <div className="col">
            <ToastContainer />
            <p class="h6">Detalle de Gastos</p>
            <ExpensesTable
              expenses={expenses}
              onDelete={this.handleDelete}
              onSort={this.handleSort}
              sortColumn={sortColumn}
              viewOnly={true}
            />
            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col" />
          <div className="col" />
        </div>
        <div className="row">
          <div className="col">Saldo Ordinario</div>
          <div className="col">
            <span class="badge badge-info">New</span>
          </div>
        </div>
        <div className="row">
          <div className="col">Recaudación Expensas Ordinarias</div>
          <div className="col">
            <span class="badge badge-info">New</span>
          </div>
        </div>
        <div className="row">
          <div className="col">Erogaciones</div>
          <div className="col">
            <span class="badge badge-danger">New</span>
          </div>
        </div>
        <div className="row">
          <div className="col">Nuevo Saldo Ordinario</div>
          <div className="col">
            <span class="badge badge-primary">New</span>
          </div>
        </div>
        <div className="row" />
      </React.Fragment>
    );
  }
}

export default CurrentMonth;
