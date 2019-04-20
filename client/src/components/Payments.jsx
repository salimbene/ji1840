import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import { Loading } from 'carbon-components-react';
import SearchBox from './common/SearchBox';
import CarbonTableTitle from './common/CarbonTableTitle';
import CarbonTablePagination from './common/CarbonTablePagination';
import CarbonModal from './common/CarbonModal';
import PeriodSelector from './common/PeriodSelector';
import PeriodsDTable from './PeriodsDTable';
import auth from '../services/authService';
import Unauthorized from './common/Unauthorized';
import { getPDetailsByPeriod, savePDetails } from '../services/pdetailsService';
import { getCurrentPeriod, getPeriod } from '../utils/dates';
import { paginate } from '../utils/paginate';
import { toast } from 'react-toastify';

class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 15,
      currentPage: 1,
      searchQuery: '',
      selectedPeriod: getPeriod(new Date()),
      sortColumn: { path: 'model', order: 'asc' },
      year: getCurrentPeriod().year,
      month: getCurrentPeriod().month,
      modal: false,
      currentUser: auth.getCurrentUser()
    };
    this.toggleRegister = this.toggleRegister.bind(this);
  }

  async componentDidMount() {
    const { selectedPeriod } = this.state;
    await this.populateDetails(selectedPeriod);
  }

  async populateDetails(period) {
    const { data: details } = await getPDetailsByPeriod(period);
    this.setState({ details });
  }

  handlePeriodSelect = async event => {
    let { year, month } = this.state;

    if (event.target.name === 'year') year = event.target.value;
    if (event.target.name === 'month') month = event.target.value;

    const selectedPeriod = year && month ? `${month} ${year}` : '';

    await this.populateDetails(selectedPeriod);
    this.setState({
      selectedPeriod,
      searchQuery: '',
      currentPage: 1,
      year,
      month
    });
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
      details: allDetails,
      pageSize,
      currentPage,
      sortColumn,
      selectedPeriod,
      searchQuery
    } = this.state;

    let filtered = allDetails;

    filtered.map(detail => {
      const { expenseA, debtA, intA, expenseB, debtB, intB } = detail;
      detail.total = expenseA + debtA + intA + expenseB + debtB + intB;
      return null;
    });

    if (searchQuery) {
      filtered = allDetails.filter(u =>
        u.model.landlord.lastname
          .toLowerCase()
          .startsWith(searchQuery.toLowerCase())
      );
    } else if (selectedPeriod)
      filtered = allDetails.filter(m => m.period === selectedPeriod);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const details = paginate(sorted, currentPage, pageSize);

    return {
      totalCount: filtered.length || 0,
      data: details
    };
  };

  toggleRegister(detail, key) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      selectedDetail: detail,
      isPayedKey: key
    }));
  }

  handleRegister = async () => {
    const { details: rollback } = this.state;
    const { selectedDetail, details, isPayedKey } = this.state;
    try {
      const detail = this.mapToMongoModel({ ...selectedDetail });

      // Optimistic update  front-end first
      const item = details.find(d => d._id === selectedDetail._id);
      if (isPayedKey) {
        item[isPayedKey] = !item[isPayedKey];
        detail[isPayedKey] = item[isPayedKey];
      } else {
        const payedAB = item.isPayedA && item.isPayedB;

        if (item.isPayedA === payedAB) detail.isPayedA = !payedAB;
        if (item.isPayedB === payedAB) detail.isPayedB = !payedAB;

        item.isPayedA = !payedAB;
        item.isPayedB = !payedAB;
      }

      // DB Update
      await savePDetails(detail);
      toast.success(`Los datos se guardaron exitosamente. ✔️`, {
        position: 'top-center'
      });
    } catch (ex) {
      console.log(ex);
      this.setState({ details: rollback });
    }
    this.toggleRegister();
  };

  mapToMongoModel(detail) {
    //DEpopulate model & userId
    delete detail.total;
    delete detail.isPayedA;
    delete detail.isPayedB;
    detail.userId = detail.userId._id;
    detail.model = detail.model._id;
    return detail;
  }

  handleSortDetails = sortColumn => {
    this.setState({ sortColumn });
  };

  modalBody = model => {
    const { label } = model;
    const { lastname } = model.landlord;
    return (
      <p className="lead">
        Se registrará el pago de expensas para <mark>{label}</mark> del
        propietario <mark>{lastname}</mark>. Adicionalmente se actualizará el
        saldo de ingresos del período.
      </p>
    );
  };

  modalProps = selectedDetail => {
    if (!selectedDetail) return null;
    const { modal } = this.state;
    const { model } = selectedDetail;
    return {
      isOpen: modal,
      title: 'Actualizar información de pagos',
      label: 'Consortia - Jose Ingenieros 1840',
      body: model && this.modalBody(model),
      cancelBtnLabel: 'Cancelar',
      submitBtnLabel: 'Confirmar',
      toggle: this.toggleRegister,
      submit: this.handleRegister
    };
  };

  render() {
    const { currentUser } = this.state;

    if (currentUser && !currentUser.isCouncil) return <Unauthorized />;

    if (!this.state.details) return <Loading />;

    const { pageSize, currentPage, searchQuery, sortColumn } = this.state;
    const { month, year } = this.state;
    const { selectedDetail } = this.state;
    const { totalCount, data: details } = this.getPageData();

    return (
      <Fragment>
        <CarbonModal {...this.modalProps(selectedDetail)} />
        <CarbonTableTitle
          title="Liquidaciones"
          helper="Lista de liquidaciones registradas."
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
            <PeriodsDTable
              data={details}
              onRegister={this.toggleRegister}
              onSort={this.handleSortDetails}
              sortColumn={sortColumn}
            />
            <CarbonTablePagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
              onPageSize={this.handlePageSize}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Payments;
