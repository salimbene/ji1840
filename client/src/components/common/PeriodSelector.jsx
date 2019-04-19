import React, { Fragment } from 'react';
import Select from './Select';
import { getLastXYears, monthLabels } from '../../utils/dates';

const PeriodSelector = ({ months, years, handlePeriod }) => {
  return (
    <Fragment>
      <Select
        name="month"
        value={months}
        options={monthLabels}
        onChange={handlePeriod}
        className="reset-margin-bottom"
      />
      <Select
        name="year"
        value={years}
        options={getLastXYears(5)}
        onChange={handlePeriod}
        className="reset-margin-bottom"
      />
    </Fragment>
  );
};

export default PeriodSelector;
