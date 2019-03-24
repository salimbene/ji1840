import React, { Component } from 'react';
import { getUsers, deleteUser } from '../services/usersService';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import SimpleModal from './common/SimpleModal';
import UsersTable from './UsersTable';
import auth from '../services/authService';
import { paginate } from '../utils/paginate';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import _ from 'lodash';

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
      toast.error(`☹️ Error:${ex.response.data}`);
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

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selected: null, currentPage: 1 });
  };

  getPageData = () => {
    const {
      users: allUsers,
      pageSize,
      currentPage,
      selected,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allUsers;

    if (searchQuery)
      filtered = allUsers.filter(u =>
        u.lastname.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selected && selected.id)
      filtered = allUsers.filter(u => u.floor === selected.id);

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

  ModalBodyDetail = user => {
    const { lastname } = user;
    return (
      <p className="lead">
        Se eliminará el usuario <mark>{lastname}</mark>.
      </p>
    );
  };

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
      <React.Fragment>
        <SimpleModal
          isOpen={this.state.modal}
          toggle={this.toggleDelete}
          title="Eliminar usuario"
          label="Eliminar"
          action={this.handleDelete}
          body={selectedUser && this.ModalBodyDetail(selectedUser)}
        />
        <div className="row units">
          <div className="col">
            <p>Usuarios registrados: {totalCount}</p>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <UsersTable
              users={users}
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
            {currentUser && currentUser.isAdmin && (
              <button
                onClick={event => this.handleAddUser(event)}
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

export default Users;
