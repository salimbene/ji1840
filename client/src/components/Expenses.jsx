import React, { Component } from 'react';
import _ from 'lodash';
import Form from './common/Form';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import ExpensesTable from './ExpensesTable';
import { paginate } from '../utils/paginate';
import { ToastContainer, toast } from 'react-toastify';
import { getExpenses, deleteExpense } from '../services/expensesService';
import auth from '../services/authService';
import 'react-toastify/dist/ReactToastify.css';
import { saveExp } from '../services/expensesService';
import Joi from 'joi-browser';

class Expenses extends Form {
  state = {
    data: {
      category: '',
      concept: '',
      type: '',
      ammount: 0,
      user: '',
      period: 0
    },
    expenses: {},
    errors: {},
    pageSize: 10,
    currentPage: 1,
    searchQuery: '',
    sortColumn: { path: 'type', order: 'asc' }
  };

  schema = {
    _id: Joi.string(),
    category: Joi.string()
      .required()
      .allow('')
      .label('Rubro'),
    concept: Joi.string()
      .required()
      .allow('')
      .label('Detalle'),
    type: Joi.string().label('Tipo'),
    ammount: Joi.number().label('Importe'),
    period: Joi.date().label('Periodo'),
    user: Joi.string()
      .allow('')
      .label('Usuario')
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

  handleAddExpense = () => {
    console.log('handleAddExpense');
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
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
        u.concept.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selected && selected.id)
      filtered = allExpenses.filter(u => u.floor === selected.id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const expenses = paginate(sorted, currentPage, pageSize);

    return {
      totalCount: filtered.length || 0,
      data: expenses
    };
  };

  doSubmit = async () => {
    const expense = { ...this.state.data };
    console.log(expense);
    console.log('doSubmit');
    // try {
    //   await saveExp(expense);
    // } catch (ex) {
    //   console.log(ex.response);
    // }

    // const { history } = this.props;
    // history.push('/expenses');
  };

  renderForm() {
    return (
      <React.Fragment>
        <div className="border border-info rounded shadow-sm p-3 mb-5 bg-white">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col">
                {this.renderInput('category', 'Categoría')}
              </div>
              <div className="col">{this.renderInput('type', 'Tipo')}</div>
              <div className="col">
                {this.renderInput('ammount', 'Importe')}
              </div>
              <div className="col">{this.renderInput('period', 'Período')}</div>
              <div className="col">{this.renderButton('Guardar')}</div>
            </div>
            <div className="row">
              <div className="col">
                {this.renderInput('concept', 'Concepto')}
              </div>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }

  renderTable() {
    const { totalCount, data } = this.getPageData();
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    return (
      <React.Fragment>
        <p>Gastos registrados: {totalCount}</p>
        <SearchBox value={searchQuery} onChange={this.handleSearch} />
        <ExpensesTable
          expenses={data}
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
      </React.Fragment>
    );
  }

  render() {
    // const { user } = this.state;

    return (
      <div className="row units">
        <div className="col">
          <ToastContainer />
          <h3>
            Registro de gastos
            <small className="text-muted"> > Detalles</small>
          </h3>
          {this.renderForm()}
          {this.renderTable()}
        </div>
      </div>
    );
  }
}

export default Expenses;
