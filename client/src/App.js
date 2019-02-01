import React, { Component } from 'react';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import Main from './components/Main';
import './App.css';
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <div className="container-fluid">
          <div className="row">
            <SideBar />
            <Main />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
