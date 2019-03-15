import React, { Component } from 'react';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import SimpleModal from './common/SimpleModal';
import ModelsTable from './ModelsTable';
import auth from '../services/authService';
import { getModels, deleteModel } from '../services/pmodelsServices';
import { paginate } from '../utils/paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Models extends Component {
  constructor(props) {
    super(props);
    this.state = {
      models: {},
      pageSize: 10,
      currentPage: 1,
      searchQuery: '',
      sortColumn: { path: 'type', order: 'asc' },
      modal: false
    };

    this.toggleDelete = this.toggleDelete.bind(this);
  }

  async componentDidMount() {
    const { data: models } = await getModels();
    this.setState({ models, user: auth.getCurrentUser() });
  }

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

  toggleDelete(unit) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      selectedUnit: unit
    }));
  }

  handleDelete = () => {
    const { selectedUser } = this.state;
    const rollback = this.state.models;
    const models = this.state.models.filter(u => u._id !== selectedUser._id);
    this.setState({ models });

    try {
      // deleteUser(selectedUser._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast('Something failed!');
        this.setState({ models: rollback });
      }
    }
    this.toggleDelete();
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
      <React.Fragment>
        <ToastContainer />
        <SimpleModal
          isOpen={this.state.modal}
          toggle={this.toggleDelete}
          title="Eliminar asignacion"
          label="Eliminar"
          action={this.handleDelete}
        />
        <div className="row units">
          <div className="col">
            <p>Modelos registrados: {totalCount}</p>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            {totalCount && (
              <React.Fragment>
                <ModelsTable
                  models={models}
                  onDelete={this.toggleDelete}
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
      </React.Fragment>
    );
  }
}

export default Models;
