import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import SearchBox from './common/SearchBox';
import CarbonTableTitle from './common/CarbonTableTitle';
import CarbonTablePagination from './common/CarbonTablePagination';
import CarbonModal from './common/CarbonModal';
import SuppliersTable from './SuppliersTable';
import auth from '../services/authService';
import { getSuppliers, deleteSupplier } from '../services/suppliersService';
import { paginate } from '../utils/paginate';
import { toast } from 'react-toastify';

class Suppliers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suppliers: {},
      pageSize: 10,
      currentPage: 1,
      searchQuery: '',
      sortColumn: { path: 'type', order: 'asc' },
      modal: false
    };
    this.toggleDelete = this.toggleDelete.bind(this);
  }

  toggleDelete(supplier) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      selectedSupplier: supplier
    }));
  }

  async componentDidMount() {
    const { data: suppliers } = await getSuppliers();
    this.setState({ suppliers, currentUser: auth.getCurrentUser() });
  }

  handleDelete = () => {
    const { selectedSupplier } = this.state;
    const rollback = this.state.suppliers;
    const suppliers = this.state.suppliers.filter(
      u => u._id !== selectedSupplier._id
    );

    this.setState({ suppliers });

    try {
      deleteSupplier(selectedSupplier._id);
    } catch (ex) {
      toast.error(`☹️ Error: ${ex.response.data}`);
      this.setState({ expenses: rollback });
    }
    this.toggleDelete();
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

  modalBody = supplier => {
    const { name } = supplier;
    return (
      <p className="lead">
        Se eliminará el proveedor <mark>{name}</mark>.
      </p>
    );
  };

  modalProps = selectedUser => ({
    isOpen: this.state.modal,
    title: 'Eliminar proveedor',
    label: 'Consortia - Jose Ingenieros 1840',
    body: selectedUser && this.modalBody(selectedUser),
    cancelBtnLabel: 'Cancelar',
    submitBtnLabel: 'Eliminar',
    toggle: this.toggleDelete,
    submit: this.handleDelete,
    danger: true
  });

  render() {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      selectedSupplier
    } = this.state;

    const { currentUser } = this.state;
    const { totalCount, data: suppliers } = this.getPageData();

    return (
      <Fragment>
        <CarbonModal {...this.modalProps(selectedSupplier)} />
        <div className="bx--row">
          <div className="bx--col">
            <CarbonTableTitle
              title="Proveedores"
              helper="Lista de proveedores registrados."
              btnLabel="Registrar proveedor"
              btnClick={this.handleAddSuppplier}
              currentUser={currentUser}
            />
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <SuppliersTable
              suppliers={suppliers}
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
      </Fragment>
    );
  }
}

export default Suppliers;
