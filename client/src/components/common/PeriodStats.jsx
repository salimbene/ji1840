import React from 'react';

const PeriodStats = ({ totalA, totalB, totalIncome }) => {
  return (
    <React.Fragment>
      <div className="row mb-2">
        <div className="col">
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Total Gastos A
              <span
                className={`badge ${
                  totalA < 0 ? 'badge-danger' : 'badge-info'
                } badge-pill ml-2`}
              >
                {`$${Number(totalA).toFixed(2)}`}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Total Gastos B
              <span
                className={`badge ${
                  totalB < 0 ? 'badge-danger' : 'badge-info'
                } badge-pill ml-2`}
              >
                {`$${Number(totalB).toFixed(2)}`}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Total Ingresos
              <span
                className={`badge ${
                  totalIncome < 0 ? 'badge-danger' : 'badge-info'
                } badge-pill ml-2`}
              >
                {`$${Number(totalIncome).toFixed(2)}`}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <mark>Saldo Mes</mark>
              <span
                className={`badge ${
                  totalIncome - totalA - totalB < 0
                    ? 'badge-danger'
                    : 'badge-success'
                } badge-pill ml-2`}
              >
                {`$${Number(totalIncome - totalA - totalB).toFixed(2)}`}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PeriodStats;
