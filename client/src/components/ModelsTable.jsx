import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Table from './common/Table';
import SimpleModal from './common/SimpleModal';
import auth from '../services/authService';

class ModelsTable extends Component {
  columns = [
    {
      path: 'label',
      label: 'Nombre'
      // content: user => <Link to={`/users/${user._id}`}>{user.lastname}</Link>
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

  constructor() {
    super();
    const currentUser = auth.getCurrentUser();
    if (currentUser && currentUser.isAdmin)
      this.columns.push(this.deleteColumn);
  }

  render() {
    const { users, onSort, sortColumn } = this.props;

    return (
      <React.Fragment>
        <Table
          columns={this.columns}
          data={users}
          sortColumn={sortColumn}
          onSort={onSort}
        />
      </React.Fragment>
    );
  }
}

export default ModelsTable;
