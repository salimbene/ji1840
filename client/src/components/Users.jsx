import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import SearchBox from './common/SearchBox';
import CarbonTableTitle from './common/CarbonTableTitle';
import CarbonTablePagination from './common/CarbonTablePagination';
import CarbonModal from './common/CarbonModal';
import UsersTable from './UsersTable';
import auth from '../services/authService';
import { getUsers, deleteUser } from '../services/usersService';
import { paginate } from '../utils/paginate';
import { toast } from 'react-toastify';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {},
      pageSize: 10,
      currentPage: 1,
      searchQuery: '',
      sortColumn: { path: 'lastname', order: 'asc' },
      modal: false
    };

    this.toggleDelete = this.toggleDelete.bind(this);
  }

  async componentDidMount() {
    const { data: users } = await getUsers();
    this.setState({ users, currentUser: auth.getCurrentUser() });
  }

  handleDelete = () => {
    const { selectedUser } = this.state;
    const rollback = this.state.users;
    const users = this.state.users.filter(u => u._id !== selectedUser._id);
    this.setState({ users });

    try {
      deleteUser(selectedUser._id);
    } catch (ex) {
      this.setState({ users: rollback });
    }
    this.toggleDelete();
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleAddUser = () => {
    const { history } = this.props;
    history.push('/register');
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

  getPageData = () => {
    const {
      users: allUsers,
      pageSize,
      currentPage,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allUsers;

    if (searchQuery)
      filtered = allUsers.filter(u =>
        u.lastname.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const users = paginate(sorted, currentPage, pageSize);

    return {
      totalCount: filtered.length || 0,
      data: users
    };
  };

  toggleDelete(user) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      selectedUser: user
    }));
  }

  modalBody = user => {
    const { lastname } = user;
    return (
      <p className="lead">
        Se eliminará el usuario <mark>{lastname}</mark>.
      </p>
    );
  };

  modalProps = selectedUser => ({
    isOpen: this.state.modal,
    title: 'Eliminar usuario',
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
      selectedUser
    } = this.state;

    const { currentUser } = this.state;
    const { totalCount, data: users } = this.getPageData();

    return (
      <Fragment>
        <CarbonModal {...this.modalProps(selectedUser)} />
        <div className="bx--row">
          <div className="bx--col">
            <CarbonTableTitle
              title="Usuarios"
              helper="Lista de usuarios registrados."
              btnLabel="Registrar usuario"
              btnClick={this.handleAddUser}
              currentUser={currentUser}
            />
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <UsersTable
              users={users}
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

export default Users;
