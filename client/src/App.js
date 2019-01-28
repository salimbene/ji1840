import React, { Component } from 'react';
import Units from './components/Units';
import NavBar from './components/NavBar';
import './App.css';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <main className="container">
          <Units />
        </main>
      </React.Fragment>
    );
  }
}

export default App;
