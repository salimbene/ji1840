import React, { Component } from 'react';
class Home extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Bienvenido a Jose Ingenieros 1840</h1>

          <img src="../ji1840.jpg" id="background" alt="" />
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
