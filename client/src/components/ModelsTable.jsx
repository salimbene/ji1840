import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CarbonTable from './common/CarbonTable';
import auth from '../services/authService';

class ModelsTable extends Component {
  constructor() {
    super();
    const currentUser = auth.getCurrentUser();
    if (currentUser && currentUser.isAdmin)
      this.columns.push(this.deleteColumn);
  }

  columns = [
    {
      path: 'label',
      label: 'Nombre',
      content: m => (
        <div className="text-center">
          <Link to={`/models/${m._id}`}>{m.label}</Link>
        </div>
      )
    },
    {
      path: 'fUnit',
      label: 'Unidades',
      content: m => (
        <div className="text-center">
          <span className="badge badge-info">
            {m.fUnits.length === 1
              ? m.fUnits[0].fUnit
              : m.fUnits
                  .reduce((prev, current) => `${(prev += current.fUnit)},`, '')
                  .slice(0, -1)}
          </span>
        </div>
      )
    },
    {
      path: 'landlord',
      label: 'Propietario',
      content: m => (
        <div className="text-center">
          <Link to={`/users/${m.landlord._id}`}>{m.landlord.lastname}</Link>
        </div>
      )
    },
    {
      path: 'coefficient',
      label: 'Coeficiente',
      content: m => (
        <div className="text-center">
          {Number(m.coefficient * 100).toFixed(3)}
        </div>
      )
    }
  ];

  deleteColumn = {
    key: 'del',
    content: model => (
      <i
        onClick={event => this.props.onDelete(model)}
        className="fa fa-trash red"
      />
    )
  };

  render() {
    const { models, onSort, sortColumn } = this.props;

    return (
      <CarbonTable
        columns={this.columns}
        data={models}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default ModelsTable;
