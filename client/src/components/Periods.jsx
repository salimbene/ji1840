import React, { Component } from 'react';

import Select from './common/Select';
import { getLastXYears, monthLabels } from '../utils/dates';

class Periods extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col col-md-2">
            <Select
              name="month"
              label="Mes"
              value={this.state.month}
              options={monthLabels}
              onChange={this.handlePeriodSelect}
            />
          </div>
          <div className="col col-md-2">
            <Select
              name="year"
              label="Año"
              value={this.state.year}
              options={getLastXYears(5)}
              onChange={this.handlePeriodSelect}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Periods;
