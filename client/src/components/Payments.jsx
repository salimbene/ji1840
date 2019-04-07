import React, { Component } from 'react';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import PeriodSelector from './common/PeriodSelector';
import SimpleModal from './common/SimpleModal';
import PeriodsDTable from './PeriodsDTable';
import auth from '../services/authService';
import { getPDetailsByPeriod, savePDetails } from '../services/pdetailsService';
import { getCurrentPeriod, getPeriod } from '../utils/dates';
import { paginate } from '../utils/paginate';
import { toast } from 'react-toastify';

class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 20,
      currentPage: 1,
      searchQuery: '',
      selectedPeriod: getPeriod(new Date()),
      sortColumn: { path: 'model', order: 'asc' },
      year: getCurrentPeriod().year,
      month: getCurrentPeriod().month,
      modal: false
    };
    this.toggleRegister = this.toggleRegister.bind(this);
  }

  async componentDidMount() {
    this.setState({ user: auth.getCurrentUser() });
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

  handlePageChange = page => {
    this.setState({ currentPage: page });
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
        console.log(detail);
        if (item.isPayedA === payedAB) detail.isPayedA = !payedAB;
        if (item.isPayedB === payedAB) detail.isPayedB = !payedAB;
        console.log(detail);
        item.isPayedA = !payedAB;
        item.isPayedB = !payedAB;
      }
      console.log(detail);
      // DB Update
      await savePDetails(detail);
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

  ModalBodyDetail = model => {
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

  render() {
    const { user } = this.state;

    if (user && !user.isAdmin)
      return (
        <div className="alert alert-danger" role="alert">
          Acceso no autorizado.
        </div>
      );

    if (!this.state.details) return 'No data available.';

    const { pageSize, currentPage, searchQuery, sortColumn } = this.state;
    const { month, year } = this.state;
    const { modal, selectedDetail } = this.state;
    const { totalCount, data: details } = this.getPageData();

    return (
      <React.Fragment>
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
        {selectedDetail && selectedDetail.model && (
          <SimpleModal
            isOpen={modal}
            toggle={this.toggleRegister}
            title="Registrar pago"
            label="Confirmar"
            action={this.handleRegister}
            body={this.ModalBodyDetail(selectedDetail.model)}
          />
        )}
        <div className="row units">
          <div className="col">
            <PeriodsDTable
              data={details}
              onRegister={this.toggleRegister}
              onSort={this.handleSortDetails}
              sortColumn={sortColumn}
            />
            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Payments;
