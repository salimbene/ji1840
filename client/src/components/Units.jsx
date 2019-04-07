import React, { Component } from 'react';
import { getUnits, deleteUnit } from '../services/unitsService';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import UnitsTable from './UnitsTable';
import auth from '../services/authService';
import { paginate } from '../utils/paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import _ from 'lodash';

class Units extends Component {
  state = {
    units: {},
    pageSize: 20,
    currentPage: 1,
    searchQuery: '',
    sortColumn: { path: 'fUnit', order: 'asc' },
    floor: [{ name: '0', id: 0 }, { name: '1', id: 1 }, { name: '2', id: 2 }]
  };

  async componentDidMount() {
    const floor = [{ id: '', name: 'all' }, ...this.state.floor];
    const { data: units } = await getUnits();
    this.setState({ units, floor, user: auth.getCurrentUser() });
  }

  handleDelete = unit => {
    const rollback = this.state.units;
    const units = this.state.units.filter(u => u._id !== unit._id);
    this.setState({ units });

    try {
      deleteUnit(unit._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast('Something failed!');
        this.setState({ units: rollback });
      }
    }
  };

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

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleFloorSelect = item => {
    this.setState({ selectedFloor: item, currentPage: 1, searchQuery: '' });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedFloor: null, currentPage: 1 });
  };

  getPageData = () => {
    const {
      units: allUnits,
      pageSize,
      currentPage,
      selectedFloor,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allUnits;

    if (searchQuery) {
      filtered = allUnits.filter(u =>
        u.landlord.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    } else if (selectedFloor && selectedFloor.id)
      filtered = allUnits.filter(u => u.floor === selectedFloor.id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const units = paginate(sorted, currentPage, pageSize);

    return {
      totalCount: filtered.length || 0,
      data: units
    };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.state;

    if (user && !user.isAdmin)
      return (
        <div className="alert alert-danger" role="alert">
          Acceso no autorizado.
        </div>
      );

    const { totalCount, data: units } = this.getPageData();

    return (
      <div className="row units">
        <div className="col">
          <ToastContainer />
          <p>Unidades registradas: {totalCount}</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <UnitsTable
            units={units}
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
          )}
        </div>
      </div>
    );
  }
}

export default Units;
