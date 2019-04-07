import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Table from './common/Table';
import auth from '../services/authService';

class UnitsTable extends Component {
  columns = [
    {
      path: 'fUnit',
      label: 'Unidad',
      content: unit => (
        <div className="text-center">
          <Link to={`/units/${unit._id}`}>{unit.fUnit}</Link>
        </div>
      )
    },
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
      path: 'floor',
      label: 'Piso',
      content: unit => <div className="text-center">{unit.floor}</div>
    },
    {
      path: 'flat',
      label: 'Rótulo',
      content: unit => <div className="text-center">{unit.flat}</div>
    },
    {
      path: 'sup.covered',
      label: 'Sup. Cubierta',
      content: unit => (
        <div className="text-center">{unit.sup.covered.toFixed(3)}</div>
      )
    },
    {
      path: 'sup.uncovered',
      label: 'Sup. Desc.',
      content: unit => (
        <div className="text-center">{unit.sup.uncovered.toFixed(3)}</div>
      )
    },
    {
      path: 'sup.semi',
      label: 'Sup. Semidesc.',
      content: unit => (
        <div className="text-center">{unit.sup.semi.toFixed(3)}</div>
      )
    },
    {
      path: 'sup.total',
      label: 'Sup. Total',
      content: unit => (
        <div className="text-center">{unit.sup.total.toFixed(3)}</div>
      )
    },
    {
      path: 'coefficient',
      label: 'Coeficiente',
      content: unit => (
        <div className="text-center">{unit.coefficient.toFixed(3)}</div>
      )
    }
  ];

  deleteColumn = {
    key: 'del',
    content: unit => (
      <i
        onClick={event => this.props.onDelete(unit)}
        className="fa fa-trash red"
      />
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
