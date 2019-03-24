import React, { Component } from 'react';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import PeriodSelector from './common/PeriodSelector';
import SimpleModal from './common/SimpleModal';
import PaymentsTable from './PaymentsTable';
import auth from '../services/authService';
import { getPayments, deletePayment } from '../services/paymentsService';
import { getCurrentPeriod } from '../utils/dates';
import { paginate } from '../utils/paginate';
import { toast } from 'react-toastify';

class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: {},
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

  toggleDelete(payment) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      selectedPayment: payment
    }));
  }

  async componentDidMount() {
    const { data: payments } = await getPayments();
    this.setState({ payments, user: auth.getCurrentUser() });
  }

  handleDelete = payment => {
    const { selectedPayment } = this.state;
    const rollback = this.state.payments;

    const payments = this.state.payments.filter(
      u => u._id !== selectedPayment._id
    );

    this.setState({ payments });

    try {
      deletePayment(selectedPayment._id);
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

  DeleteMsgBody = () => {
    return (
      <p className="lead">
        El pago seleccionado se elimnará y producirá un ajusto en el balance del
        usuario.
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
    const { selectedPayment } = this.state;
    const { totalCount, data: payments } = this.getPageData();

    return (
      <React.Fragment>
        <SimpleModal
          isOpen={this.state.modal}
          toggle={this.toggleDelete}
          title="Eliminar gasto"
          label="Eliminar"
          action={this.handleDelete}
          body={selectedPayment && this.DeleteMsgBody(selectedPayment)}
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
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
          </div>
        </div>
        {this.renderViewTags(payments, selectedPeriod)}
        <div className="row units">
          <div className="col">
            <PaymentsTable
              payments={payments}
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
