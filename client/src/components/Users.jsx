import React, { Component } from 'react';
import { getUsers, deleteUser } from '../services/usersService';
import Pagination from './common/Pagination';
import SearchBox from './common/SearchBox';
import UsersTable from './UsersTable';
import auth from '../services/authService';
import { paginate } from '../utils/paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import _ from 'lodash';

class Users extends Component {
  state = {
    users: {},
    pageSize: 10,
    currentPage: 1,
    searchQuery: '',
    sortColumn: { path: 'lastname', order: 'asc' }
  };

  async componentDidMount() {
    // const { data } = await getGenres();
    // const genres = [{ _id: "", name: "All Genres" }, ...data];

    const { data: users } = await getUsers();
    this.setState({ users, user: auth.getCurrentUser() });
  }

  handleDelete = user => {
    const rollback = this.state.users;
    const users = this.state.users.filter(u => u._id !== user._id);
    this.setState({ users });

    try {
      deleteUser(user._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast('Something failed!');
        this.setState({ users: rollback });
      }
    }
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleAddUnit = () => {
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

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.state;

    const { totalCount, data: users } = this.getPageData();

    return (
      <div className="row units">
        <div className="col">
          <ToastContainer />
          <p>Usuarios registrados: {totalCount}</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <UsersTable
            users={users}
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
          {user && (
            <button
              onClick={event => this.handleAddUnit(event)}
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

export default Users;
