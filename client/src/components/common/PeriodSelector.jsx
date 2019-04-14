import React, { Fragment } from 'react';
import Select from './Select';
import { getLastXYears, monthLabels } from '../../utils/dates';

const PeriodSelector = ({ months, years, handlePeriod }) => {
  return (
    <Fragment>
      <div className="bx--col">
        <Select
          name="month"
          value={months}
          options={monthLabels}
          onChange={handlePeriod}
        />
      </div>
      <div className="bx--col">
        <Select
          name="year"
          value={years}
          options={getLastXYears(5)}
          onChange={handlePeriod}
        />
      </div>
    </Fragment>
  );
};

export default PeriodSelector;
