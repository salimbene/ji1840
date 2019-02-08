import React, { Component } from 'react';
import { getUnits, deleteUnit, updateUnit } from '../services/unitsService';
import Pagination from './common/Pagination';
import ListGroup from './common/ListGroup';
import SearchBox from './common/SearchBox';
import UnitsTable from './UnitsTable';
import { paginate } from '../utils/paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import _ from 'lodash';

class Units extends Component {
  state = {
    units: {},
    pageSize: 3,
    currentPage: 1,
    searchQuery: '',
    sortColumn: { path: 'fUnit', order: 'asc' },
    floor: [{ name: 'a', id: 0 }, { name: 'b', id: 1 }, { name: 'c', id: 2 }]
  };

  async componentDidMount() {
    const floor = [{ id: '', name: 'all' }, ...this.state.floor];
    const { data: units } = await getUnits();
    this.setState({ units, floor });
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

  handleUpdate = async unit => {
    unit.landlord.lastname = 'Salimbene';

    await updateUnit(unit);
    const units = [...this.state.units];
    const index = units.indexOf(unit);
    units[index] = { ...unit };
    this.setState({ units });
  };

  handleSort = sortColumn => {
    console.log(sortColumn);
    this.setState({ sortColumn });
  };

  handleAddUnit = () => {
    // const fUnit = {
    //   fUnit: 351,
    //   floor: 2,
    //   flat: 'D',
    //   share: 4.6,
    //   landlord: {
    //     user: '5c425cf738e2bc62ce2bce98',
    //     lastname: 'Salimbene'
    //   }
    // };
    // await addUnit(fUnit);
    // const units = [fUnit, ...this.state.units];
    // this.setState({ units });

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
    if (searchQuery)
      filtered = allUnits.filter(u =>
        u.field.toLowerCase().startsWidh(searchQuery.toLowerCase())
      );
    else if (selectedFloor && selectedFloor.id)
      filtered = allUnits.filter(u => u.floor === selectedFloor.id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const units = paginate(sorted, currentPage, pageSize);

    return {
      totalCount: filtered.length || 0,
      data: units
    };
  };

  render() {
    const { length: count } = this.state.units;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0) return <p>No existen unidades funcionales registradas.</p>;

    const { totalCount, data: units } = this.getPageData();

    return (
      <div className="row units">
        <div className="col-1">
          <ListGroup
            items={this.state.floor}
            selectedItem={this.state.selectedFloor}
            onItemSelect={this.handleFloorSelect}
          />
        </div>

        <div className="col">
          <ToastContainer />
          {user && (
            <button
              onClick={event => this.handleAddUnit(event)}
              className="btn btn-primary btn-sm"
              style={{ marginBottom: 20 }}
            >
              Nuevo
            </button>
          )}
          <p>Unidades funcionales registradas: {totalCount}</p>
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
        </div>
      </div>
    );
  }
}

export default Units;
