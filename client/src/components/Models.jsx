import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import SearchBox from './common/SearchBox';
import CarbonTableTitle from './common/CarbonTableTitle';
import CarbonTablePagination from './common/CarbonTablePagination';
import CarbonModal from './common/CarbonModal';
import ModelsTable from './ModelsTable';
import auth from '../services/authService';
import { getModels, deleteModel } from '../services/pmodelsServices';
import { paginate } from '../utils/paginate';
import Unauthorized from './common/Unauthorized';

class Models extends Component {
  constructor(props) {
    super(props);
    this.state = {
      models: {},
      pageSize: 15,
      currentPage: 1,
      searchQuery: '',
      sortColumn: { path: 'type', order: 'asc' },
      modal: false
    };

    this.toggleDelete = this.toggleDelete.bind(this);
  }

  async componentDidMount() {
    const { data: models } = await getModels();
    this.setState({ models, currentUser: auth.getCurrentUser() });
  }

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleAddModel = () => {
    const { history } = this.props;
    history.push('/models/new');
  };

  handlePageSize = event => {
    this.setState({ pageSize: event.target.value });
  };

  handlePageChange = (page, arrow, pagesCount) => {
    const { value } = page.target;
    let { currentPage } = this.state;

    currentPage = value ? Number(value) : (currentPage += arrow);
    if (currentPage < 1) currentPage = 1;
    if (currentPage > pagesCount) currentPage = pagesCount;

    this.setState({ currentPage });
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

  modalBody = model => {
    const { label, landlord } = model;
    if (!landlord) return null;
    return (
      <p className="lead">
        El esquema {label} asignado a {landlord.lastname} se eliminará.
      </p>
    );
  };

  modalProps = selectedUser => ({
    isOpen: this.state.modal,
    title: 'Eliminar esquema de expensas',
    label: 'Consortia - Jose Ingenieros 1840',
    body: selectedUser && this.modalBody(selectedUser),
    cancelBtnLabel: 'Cancelar',
    submitBtnLabel: 'Eliminar',
    toggle: this.toggleDelete,
    submit: this.handleDelete,
    danger: true
  });
  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { currentUser, selectedModel } = this.state;

    if (currentUser && !currentUser.isCouncil) return <Unauthorized />;

    const { totalCount, data: models } = this.getPageData();

    return (
      <div className="bx--row cc--models-form">
        <div className="bx--col">
          <CarbonModal {...this.modalProps(selectedModel)} />
          <CarbonTableTitle
            title="Esquemas de expensas"
            helper="Lista de esquemas para el regitro de espensas."
            btnLabel="Registrar esquema"
            btnClick={this.handleAddModel}
            currentUser={currentUser}
          />
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <ModelsTable
            models={models}
            onDelete={this.toggleDelete}
            onSort={this.handleSort}
            sortColumn={sortColumn}
          />
          <CarbonTablePagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageSize={this.handlePageSize}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Models;
