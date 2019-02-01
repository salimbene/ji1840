import React, { Component } from 'react';
import {
  getUnits,
  deleteUnit,
  updateUnit,
  addUnit
} from '../services/unitsService';
import Pagination from './common/Pagination';
import ListGroup from './common/ListGroup';
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

  handleAddUnit = async () => {
    const fUnit = {
      fUnit: 351,
      floor: 2,
      flat: 'D',
      share: 4.6,
      landlord: {
        user: '5c425cf738e2bc62ce2bce98',
        lastname: 'Salimbene'
      }
    };

    await addUnit(fUnit);
    const units = [fUnit, ...this.state.units];
    this.setState({ units });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleFloorSelect = item => {
    this.setState({ selectedFloor: item, currentPage: 1 });
  };

  getPageData = () => {
    const {
      units: allUnits,
      pageSize,
      currentPage,
      selectedFloor,
      sortColumn
    } = this.state;

    const filtered =
      selectedFloor && selectedFloor.id
        ? allUnits.filter(u => u.floor === selectedFloor.id)
        : allUnits;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const units = paginate(sorted, currentPage, pageSize);

    return {
      totalCount: filtered.length || 0,
      data: units
    };
  };

  render() {
    const { length: count } = this.state.units;
    const { pageSize, currentPage, sortColumn } = this.state;

    if (count === 0) return <p>No existen unidades funcionales registradas.</p>;

    const { totalCount, data: units } = this.getPageData();

    return (
      <div className="row">
        <div className="col-2">
          <ListGroup
            items={this.state.floor}
            selectedItem={this.state.selectedFloor}
            onItemSelect={this.handleFloorSelect}
          />
        </div>
        <div className="col">
          <ToastContainer />
          <button
            onClick={event => this.handleAddUnit(event)}
            className="btn btn-info btn-sm"
          >
            Add
          </button>
          <button
            onClick={event => this.handleUpdate(this.state.units[1])}
            className="btn btn-info btn-sm"
          >
            Update
          </button>
          <button
            onClick={event => this.handleDelete(this.state.units[1])}
            className="btn btn-danger btn-sm"
          >
            Del
          </button>
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
