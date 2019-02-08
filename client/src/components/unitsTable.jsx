import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Table from './common/Table';
import auth from '../services/authService';

class UnitsTable extends Component {
  columns = [
    {
      path: 'landlord.lastname',
      label: 'Propietario',
      content: unit => (
        <Link to={`/users/${unit.landlord.userId}`}>{unit.landlord.name}</Link>
      )
    },
    {
      path: 'fUnit',
      label: 'Unidad',
      content: unit => <Link to={`/units/${unit._id}`}>{unit.fUnit}</Link>
    },
    { path: 'floor', label: 'Piso' },
    { path: 'flat', label: 'Puerta' },
    { path: 'share', label: 'Participación' }
  ];

  deleteColumn = {
    key: 'del',
    content: unit => (
      <button
        onClick={event => this.props.onDelete(event.target.tabIndex)}
        className="btn btn-danger btn-sm"
      >
        Eliminar
      </button>
    )
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user & user.isAdmin) this.columns.push(this.deleteColumn);
  }

  render() {
    const { units, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={units}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default UnitsTable;
