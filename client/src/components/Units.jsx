import React, { Component } from 'react';
import _ from 'lodash';
import { Loading } from 'carbon-components-react';
import { getUnits, deleteUnit } from '../services/unitsService';
import SearchBox from './common/SearchBox';
import CarbonTableTitle from './common/CarbonTableTitle';
import CarbonTablePagination from './common/CarbonTablePagination';
import CarbonModal from './common/CarbonModal';
import Unauthorized from './common/Unauthorized';
import UnitsTable from './UnitsTable';
import auth from '../services/authService';
import { paginate } from '../utils/paginate';

class Units extends Component {
  constructor(props) {
    super(props);
    this.state = {
      units: {},
      pageSize: 20,
      currentPage: 1,
      searchQuery: '',
      sortColumn: { path: 'fUnit', order: 'asc' },
      currentUser: auth.getCurrentUser()
    };

    this.toggleDelete = this.toggleDelete.bind(this);
  }

  async componentDidMount() {
    const { data: units } = await getUnits();
    this.setState({ units });
  }

  handleDelete = () => {
    const { selectedUnit } = this.state;
    const rollback = this.state.units;
    const units = this.state.units.filter(u => u._id !== selectedUnit._id);
    this.setState({ units });

    try {
      deleteUnit(selectedUnit._id);
    } catch (ex) {
      this.setState({ units: rollback });
    }
    this.toggleDelete();
  };

  toggleDelete(unit) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      selectedUnit: unit
    }));
  }
  // handleUpdate = async unit => {
  //   await updateUnit(unit);
  //   const units = [...this.state.units];
  //   const index = units.indexOf(unit);
  //   units[index] = { ...unit };
  //   this.setState({ units });
  // };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleAddUnit = () => {
    const { history } = this.props;
    history.push('/units/new');
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
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  getPageData = () => {
    const {
      units: allUnits,
      pageSize,
      currentPage,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allUnits;

    if (searchQuery)
      filtered = allUnits.filter(u =>
        u.landlord.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const units = paginate(sorted, currentPage, pageSize);

    return {
      totalCount: filtered.length || 0,
      data: units
    };
  };

  modalBody = unit => {
    const { fUnit, landlord } = unit;
    if (!landlord) return null;
    return (
      <p className="lead">
        Se eliminará la unidad <mark>{fUnit}</mark> asignada a{' '}
        <mark>{landlord.name}</mark>.
      </p>
    );
  };

  modalProps = selectedUnit => ({
    isOpen: this.state.modal,
    title: 'Eliminar unidad',
    label: 'Consortia - Jose Ingenieros 1840',
    body: selectedUnit && this.modalBody(selectedUnit),
    cancelBtnLabel: 'Cancelar',
    submitBtnLabel: 'Eliminar',
    toggle: this.toggleDelete,
    submit: this.handleDelete,
    danger: true
  });

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { currentUser, selectedUnit } = this.state;

    if (!this.state.units) return <Loading />;

    if (currentUser && !currentUser.isCouncil) return <Unauthorized />;

    const { totalCount, data: units } = this.getPageData();

    return (
      <div className="bx--row">
        <div className="bx--col">
          <CarbonModal {...this.modalProps(selectedUnit)} />
          <CarbonTableTitle
            title="Unidades"
            helper="Lista de unidades funcionales y complementarias."
            btnLabel="Registrar unidad"
            btnClick={this.handleAddUnit}
            currentUser={currentUser}
          />
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <UnitsTable
            units={units}
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
    );
  }
}

export default Units;
