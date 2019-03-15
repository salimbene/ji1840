import React, { Component } from 'react';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import ModelsForm from './ModelsForm';
import auth from '../services/authService';
import { getModels, deleteModel } from '../services/pmodelsServices';
import { paginate } from '../utils/paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Models extends Component {
  state = {
    models: {},
    pageSize: 10,
    currentPage: 1,
    searchQuery: '',
    sortColumn: { path: 'type', order: 'asc' }
  };

  async componentDidMount() {
    console.log('componentDidMount models');
    const { data: models } = await getModels();
    this.setState({ models, user: auth.getCurrentUser() });
  }

  handleDelete = model => {
    const rollback = this.state.models;
    const models = this.state.models.filter(u => u._id !== model._id);
    this.setState({ models });

    try {
      deleteModel(model._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast('Something failed!');
        this.setState({ models: rollback });
      }
    }
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleAddModel = () => {
    const { history } = this.props;
    history.push('/models/new');
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  getPageData = () => {
    const {
      models: allModels,
      pageSize,
      currentPage,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allModels;

    if (searchQuery) {
      filtered = allModels.filter(u =>
        u.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const models = paginate(sorted, currentPage, pageSize);
    return {
      totalCount: filtered.length || 0,
      data: models
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

    const { totalCount, data: models } = this.getPageData();

    return (
      <div className="row units">
        <div className="col">
          <ToastContainer />
          <p>Modelos registrados: {totalCount}</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          {totalCount && (
            <React.Fragment>
              <ModelsForm
                models={models}
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
              onClick={event => this.handleAddModel(event)}
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

export default Models;
