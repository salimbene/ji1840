import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import SearchBox from './common/SearchBox';
import CarbonTableTitle from './common/CarbonTableTitle';
import CarbonTablePagination from './common/CarbonTablePagination';
import CarbonModal from './common/CarbonModal';
import Unauthorized from './common/Unauthorized';
import PeriodSelector from './common/PeriodSelector';
import ExpensesTable from './ExpensesTable';
import auth from '../services/authService';
import { getExpenses, deleteExpense } from '../services/expensesService';
import { getCurrentPeriod } from '../utils/dates';
import { paginate } from '../utils/paginate';
import { currency } from '../utils/formatter';

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
      modal: false,
      currentUser: auth.getCurrentUser()
    };
    this.toggleDelete = this.toggleDelete.bind(this);
  }

  async componentDidMount() {
    const { data: expenses } = await getExpenses();
    this.setState({ expenses });
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

  toggleDelete(expense) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      selectedExpense: expense
    }));
  }
  renderViewTags = (data, selected) => {
    const count = data.length;
    return (
      <p>
        {`Gastos: `}
        <mark>{count}</mark>
        {` Importe Total: `}
        <mark>
          {currency(
            data.reduce((prev, current) => (prev += current.ammount), 0)
          )}
        </mark>
        {` Filtro: `}
        <mark>{selected ? selected : 'Todos los períodos. '}</mark>
      </p>
    );
  };

  modalBody = expense => {
    const { concept } = expense;
    return (
      <p className="lead">
        Se eliminará el gasto con concepto: <mark>{concept}</mark>.
      </p>
    );
  };

  modalProps = selectedExpense => ({
    isOpen: this.state.modal,
    title: 'Eliminar gastos',
    label: 'Consortia - Jose Ingenieros 1840',
    body: selectedExpense && this.modalBody(selectedExpense),
    cancelBtnLabel: 'Cancelar',
    submitBtnLabel: 'Eliminar',
    toggle: this.toggleDelete,
    submit: this.handleDelete,
    danger: true
  });

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
    const { selectedExpense, currentUser } = this.state;

    if (currentUser && !currentUser.isCouncil) return <Unauthorized />;
    return (
      <Fragment>
        <CarbonModal {...this.modalProps(selectedExpense)} />
        <CarbonTableTitle
          title="Gastos"
          helper={this.renderViewTags(expenses, selectedPeriod)}
          btnLabel="Registrar gasto"
          btnClick={this.handleAddExpense}
          currentUser={currentUser}
        />
        <div className="cc--expenses-grid">
          <PeriodSelector
            months={month}
            years={year}
            handlePeriod={this.handlePeriodSelect}
          />

          <SearchBox value={searchQuery} onChange={this.handleSearch} />
        </div>
        <div className="bx--row">
          <div className="bx--col">
            <ExpensesTable
              expenses={expenses}
              onDelete={this.toggleDelete}
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

export default Expenses;
