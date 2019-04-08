import React from 'react';

const ExpensesBanner = ({ consortia, period }) => {
  const { name, mail, address } = consortia;
  return (
    <React.Fragment>
      <div className="container mb-5">
        <div className="row">
          <div className="col text-center">
            <p className="lead h4">Consorcio {name}</p>
          </div>
        </div>
        <div className="row">
          <div className="col text-center table-10">{address}</div>
        </div>
        <div className="row">
          <div className="col text-center table-10 p-1">{mail}</div>
        </div>
        <div className="row">
          <div className="col text-center mt-2">
            <strong>{`Liquidación de expensas ${period}`}</strong>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ExpensesBanner;
