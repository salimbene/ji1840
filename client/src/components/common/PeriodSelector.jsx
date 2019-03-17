import React from 'react';
import Select from './Select';
import { getLastXYears, monthLabels } from '../../utils/dates';

const PeriodSelector = ({ months, years, handlePeriod }) => {
  return (
    <div className="row mb-2">
      <div className="col">
        <Select
          name="month"
          label="Mes"
          value={months}
          options={monthLabels}
          onChange={handlePeriod}
        />
      </div>
      <div className="col">
        <Select
          name="year"
          label="Año"
          value={years}
          options={getLastXYears(5)}
          onChange={handlePeriod}
        />
      </div>
    </div>
  );
};

export default PeriodSelector;
