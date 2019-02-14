import React, { Component } from 'react';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import SuppliersTable from './SuppliersTable';
import auth from '../services/authService';
import { getSuppliers, deleteSupplier } from '../services/suppliersService';
import { paginate } from '../utils/paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Suppliers extends Component {
  state = {
    suppliers: {},
    pageSize: 10,
    currentPage: 1,
    searchQuery: '',
    sortColumn: { path: 'type', order: 'asc' }
  };

  async componentDidMount() {
    const { data: suppliers } = await getSuppliers();
    console.log(suppliers);
    this.setState({ suppliers, user: auth.getCurrentUser() });
  }

  handleDelete = supplier => {
    const rollback = this.state.suppliers;
    const suppliers = this.state.suppliers.filter(u => u._id !== supplier._id);
    this.setState({ suppliers });

    try {
      deleteSupplier(supplier._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast('Something failed!');
        this.setState({ suppliers: rollback });
      }
    }
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleAddSuppplier = () => {
    const { history } = this.props;
    history.push('/suppliers/new');
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  getPageData = () => {
    const {
      suppliers: allSuppliers,
      pageSize,
      currentPage,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allSuppliers;

    if (searchQuery) {
      filtered = allSuppliers.filter(u =>
        u.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const suppliers = paginate(sorted, currentPage, pageSize);
    return {
      totalCount: filtered.length || 0,
      data: suppliers
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

    const { totalCount, data: suppliers } = this.getPageData();

    return (
      <div className="row units">
        <div className="col">
          <ToastContainer />
          <p>Proveedores registrados: {totalCount}</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          {totalCount && (
            <React.Fragment>
              <SuppliersTable
                suppliers={suppliers}
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
            </React.Fragment>
          )}
          {user && (
            <button
              onClick={event => this.handleAddSuppplier(event)}
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

export default Suppliers;
