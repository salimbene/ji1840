import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Table from './common/Table';
import auth from '../services/authService';

class UnitsTable extends Component {
  columns = [
    {
      path: 'landlord.name',
      label: 'Propietario',
      content: unit =>
        unit.landlord.name !== 'disponible' ? (
          <Link to={`/users/${unit.landlord.userId}`}>
            {unit.landlord.name}
          </Link>
        ) : (
          unit.landlord.name
        )
    },
    {
      path: 'fUnit',
      label: 'Unidad',
      content: unit => <Link to={`/units/${unit._id}`}>{unit.fUnit}</Link>
    },
    { path: 'floor', label: 'Piso' },
    { path: 'flat', label: 'Rótulo' },
    {
      path: 'sup.total',
      label: 'Superficie Total',
      content: unit => unit.sup.total.toPrecision(4)
    },
    { path: 'coefficient', label: 'Coeficiente' }
  ];

  deleteColumn = {
    key: 'del',
    content: unit => (
      <button
        onClick={event => this.props.onDelete(unit)}
        className="btn btn-danger btn-sm"
      >
        Eliminar
      </button>
    )
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.columns.push(this.deleteColumn);
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
