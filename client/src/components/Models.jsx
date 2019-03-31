import React, { Component } from 'react';
import _ from 'lodash';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import SimpleModal from './common/SimpleModal';
import ModelsTable from './ModelsTable';
import auth from '../services/authService';
import { getModels, deleteModel } from '../services/pmodelsServices';
import { paginate } from '../utils/paginate';

class Models extends Component {
  constructor(props) {
    super(props);
    this.state = {
      models: {},
      pageSize: 20,
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

  toggleDelete(model) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      selectedModel: model
    }));
  }

  handleDelete = () => {
    const { selectedModel } = this.state;
    const rollback = this.state.models;

    const models = this.state.models.filter(u => u._id !== selectedModel._id);

    this.setState({ models });

    try {
      deleteModel(selectedModel._id);
    } catch (ex) {
      this.setState({ models: rollback });
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
        u.label.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const models = paginate(sorted, currentPage, pageSize);

    return {
      totalCount: filtered.length || 0,
      data: models
    };
  };

  deleteMsgBody = () => {
    return <p className="lead">El esquema selecionado se eliminará.</p>;
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery, user } = this.state;

    if (user && !user.isAdmin)
      return (
        <div className="alert alert-danger" role="alert">
          Acceso no autorizado.
        </div>
      );

    const { totalCount, data: models } = this.getPageData();

    return (
      <React.Fragment>
        <SimpleModal
          isOpen={this.state.modal}
          toggle={this.toggleDelete}
          title="Eliminar esquema de expensas"
          label="Eliminar"
          action={this.handleDelete}
          body={this.deleteMsgBody()}
        />
        <div className="row models">
          <div className="col">
            <p>Esquemas de expensas registrados: {totalCount}</p>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            {totalCount > 0 && (
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
