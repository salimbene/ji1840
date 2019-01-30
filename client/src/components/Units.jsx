import React, { Component } from 'react';
import {
  getUnits,
  deleteUnit,
  updateUnit,
  addUnit
} from '../services/unitsService';
import Pagination from './common/pagination';
import ListGroup from './common/listGroup';
import { paginate } from '../utils/paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { debuglog } from 'util';

class Units extends Component {
  state = {
    units: {},
    pageSize: 1,
    currentPage: 1,
    floor: [{ name: 'a', id: 0 }, { name: 'b', id: 1 }, { name: 'c', id: 2 }]
  };

  async componentDidMount() {
    const floor = [{ name: 'all' }, ...this.state.floor];
    const { data: units } = await getUnits();
    this.setState({ units, floor });
  }

  renderTable = unit => {
    return unit.map((u, i) => (
      <tr key={i}>
        <th scope="row">{u.landlord.lastname}</th>
        <td>{u.fUnit}</td>
        <td>{u.floor}</td>
        <td>{u.flat}</td>
        <td>{u.share}</td>
        <td>
          <button
            onClick={event => this.handleDelete(u, event.target.tabIndex)}
            className="btn btn-danger btn-sm"
            tabIndex={i}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  };

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

    const { data } = await updateUnit(unit);
    const units = [...this.state.units];
    const index = units.indexOf(unit);
    units[index] = { ...unit };
    this.setState({ units });
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

    const { data: unit } = await addUnit(fUnit);
    const units = [fUnit, ...this.state.units];
    this.setState({ units });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleFloorSelect = item => {
    this.setState({ selectedFloor: item, currentPage: 1 });
  };

  render() {
    const { length: count } = this.state.units;
    const {
      units: allUnits,
      pageSize,
      currentPage,
      selectedFloor
    } = this.state;

    if (count === 0) return <p>No existen unidades funcionales registradas.</p>;

    const filtered =
      selectedFloor && selectedFloor.id
        ? allUnits.filter(u => u.floor === selectedFloor.id)
        : allUnits;

    const units = paginate(filtered, currentPage, pageSize);

    return (
      <div className="row">
        <div className="col-2">
          <ListGroup
            items={this.state.floor}
            onItemSelect={this.handleFloorSelect}
            selectedItem={this.state.selectedFloor}
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
          {this.state.units.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Propietario</th>
                  <th scope="col">Unidad Funcional</th>
                  <th scope="col">Piso</th>
                  <th scope="col">Puerta</th>
                  <th scope="col">Participación</th>
                </tr>
              </thead>
              <tbody>{this.renderTable(units)}</tbody>
            </table>
          ) : (
            <p>No hay mas nada!</p>
          )}
          <Pagination
            itemsCount={filtered.length}
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
