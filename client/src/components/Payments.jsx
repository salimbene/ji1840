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
      const { expenses, extra, debt, int } = detail;
      detail.total = expenses + extra + debt + int;
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

  toggleRegister(detail) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      selectedDetail: detail
    }));
  }

  handleRegister = async () => {
    const { details: rollback } = this.state;
    const { selectedDetail, details } = this.state;

    try {
      const detail = this.mapToMongoModel({ ...selectedDetail });
      const item = details.find(d => d._id === detail._id);
      item.isPayed = !item.isPayed;
      await savePDetails(detail);
    } catch (ex) {
      this.setState({ details: rollback });
    }
    this.toggleRegister(selectedDetail);
  };

  mapToMongoModel(details) {
    //DEpopulate model & userId
    delete details.total;
    details.userId = details.userId._id;
    details.model = details.model._id;
    return details;
  }

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
