import React, { Component } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import PeriodSelector from './common/PeriodSelector';
import SimpleModal from './common/SimpleModal';
import ExpensesTable from './ExpensesTable';
import auth from '../services/authService';
import { getExpenses, deleteExpense } from '../services/expensesService';
import { getCurrentPeriod } from '../utils/dates';
import { paginate } from '../utils/paginate';

class Expenses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expenses: {},
      pageSize: 10,
      currentPage: 1,
      searchQuery: '',
      selectedPeriod: null,
      sortColumn: { path: 'type', order: 'asc' },
      year: getCurrentPeriod().year,
      month: getCurrentPeriod().month,
      modal: false
    };
    this.toggleDelete = this.toggleDelete.bind(this);
  }

  toggleDelete(expense) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      selectedExpense: expense
    }));
  }

  async componentDidMount() {
    const { data: expenses } = await getExpenses();
    this.setState({ expenses, user: auth.getCurrentUser() });
  }

  handleDelete = () => {
    const { selectedExpense } = this.state;
    const rollback = this.state.expenses;

    const expenses = this.state.expenses.filter(
      u => u._id !== selectedExpense._id
    );
    this.setState({ expenses });

    try {
      deleteExpense(selectedExpense._id);
    } catch (ex) {
      toast.error(`☹️ Error: ${ex.response.data}`);
      this.setState({ expenses: rollback });
    }

    this.toggleDelete();
  };

  handlePeriodSelect = event => {
    let { year, month } = this.state;

    if (event.target.name === 'year') year = event.target.value;
    if (event.target.name === 'month') month = event.target.value;

    const selectedPeriod = year && month ? `${month} ${year}` : '';

    this.setState({
      selectedPeriod,
      searchQuery: '',
      currentPage: 1,
      year,
      month
    });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleAddExpense = () => {
    const { history } = this.props;
    history.push('/expenses/new');
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedPeriod: null, currentPage: 1 });
  };

  getPageData = () => {
    const {
      expenses: allExpenses,
      pageSize,
      currentPage,
      sortColumn,
      selectedPeriod,
      searchQuery
    } = this.state;

    let filtered = allExpenses;

    if (searchQuery)
      filtered = allExpenses.filter(u =>
        u.concept.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedPeriod)
      filtered = allExpenses.filter(m => m.period === selectedPeriod);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const expenses = paginate(sorted, currentPage, pageSize);

    return {
      totalCount: filtered.length || 0,
      data: expenses
    };
  };

  DeleteMsgBody = expense => {
    const { concept } = expense;
    return (
      <p className="lead">
        Se eliminará el gasto con concepto: <mark>{concept}</mark>.
      </p>
    );
  };

  renderViewTags = (data, selected) => {
    const count = data.length;
    return (
      <React.Fragment>
        <p className="mb-1 mt-3">
          Gastos
          <mark>{count}</mark>
          Periodo
          <mark>{selected ? selected : 'Todos los periodos.'}</mark>
          Importe Total
          <mark>
            $
            {Number(
              data
                .reduce((prev, current) => (prev += current.ammount), 0)
                .toFixed(2)
            )}
          </mark>
        </p>
      </React.Fragment>
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
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      selectedPeriod
    } = this.state;
    const { month, year } = this.state;
    const { totalCount, data: expenses } = this.getPageData();
    const { selectedExpense } = this.state;

    return (
      <React.Fragment>
        <SimpleModal
          isOpen={this.state.modal}
          toggle={this.toggleDelete}
          title="Eliminar gasto"
          label="Eliminar"
          action={this.handleDelete}
          body={selectedExpense && this.DeleteMsgBody(selectedExpense)}
        />
        <div className="row align-items-end">
          <div className="col-sm-5">
            <PeriodSelector
              months={month}
              years={year}
              handlePeriod={this.handlePeriodSelect}
            />
          </div>
          <div className="col">
            <SearchBox
              value={searchQuery}
              onChange={this.handleSearch}
              className=""
            />
          </div>
        </div>

        {this.renderViewTags(expenses, selectedPeriod)}
        <div className="row">
          <div className="col">
            <ExpensesTable
              expenses={expenses}
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
            {user && (
              <button
                onClick={event => this.handleAddExpense(event)}
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

export default Expenses;
