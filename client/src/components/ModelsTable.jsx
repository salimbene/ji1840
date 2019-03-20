import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Table from './common/Table';
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
      content: m => <Link to={`/models/${m._id}`}>{m.label}</Link>
    },
    {
      path: 'fUnit',
      label: 'Unidades',
      content: m => (
        <span className="badge badge-info">
          {m.fUnits.length === 1
            ? m.fUnits[0].fUnit
            : m.fUnits
                .reduce((prev, current) => `${(prev += current.fUnit)},`, '')
                .slice(0, -1)}
        </span>
      )
    },
    {
      path: 'userId',
      label: 'Usuario',
      content: m => (
        <Link to={`/users/${m.userId._id}`}>{m.userId.lastname}</Link>
      )
    },
    {
      path: 'coefficient',
      label: 'Coeficiente'
    }
  ];

  deleteColumn = {
    key: 'del',
    content: model => (
      <button
        onClick={event => this.props.onDelete(model)}
        className="btn btn-danger btn-sm"
      >
        Eliminar
      </button>
    )
  };

  render() {
    const { models, onSort, sortColumn } = this.props;

    return (
      <React.Fragment>
        <Table
          columns={this.columns}
          data={models}
          sortColumn={sortColumn}
          onSort={onSort}
        />
      </React.Fragment>
    );
  }
}

export default ModelsTable;
