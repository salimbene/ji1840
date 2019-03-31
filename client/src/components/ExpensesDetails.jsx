import React from 'react';
import _ from 'lodash';
import { currency } from '../utils/formatter';
const ExpensesDetails = ({ details }) => {
  const sorted = _.sortBy(details, 'model.label', 'asc');
  const subtExpenses = sorted.reduce(
    (acum, current) => (acum += current.expenses),
    0
  );
  const subtExtra = sorted.reduce(
    (acum, current) => (acum += current.extra),
    0
  );
  const subtDebt = sorted.reduce((acum, current) => (acum += current.debt), 0);
  const subtInt = sorted.reduce((acum, current) => (acum += current.int), 0);
  const totCoef = sorted.reduce(
    (acum, current) => (acum += current.coefficient),
    0
  );

  return (
    <React.Fragment>
      <div className="border border-info rounded shadow-sm p-3 mt-5 bg-white adjust">
        <table className="table table-sm">
          <thead>
            <tr>
              <th scope="col" className="text-center">
                Unidad
              </th>
              <th scope="col" className="text-center">
                %
              </th>
              <th scope="col" className="text-center">
                Propietario
              </th>
              <th scope="col" className="text-center">
                Exp. A
              </th>
              <th scope="col" className="text-center">
                Exp. B
              </th>
              <th scope="col" className="text-center">
                Deuda
              </th>
              <th scope="col" className="text-center">
                Interés
              </th>
              <th scope="col" className="text-center">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((d, ind) => {
              return (
                <tr key={ind}>
                  <th scope="col" className="text-monospace text-center">
                    {d.model.label}
                  </th>
                  <td>{Number(d.model.coefficient * 100).toFixed(2)}</td>
                  <td>{d.model.landlord.lastname}</td>
                  <td className="text-right">{currency(d.expenses)}</td>
                  <td className="text-right">{currency(d.extra)}</td>
                  <td className="text-right">{currency(d.debt)}</td>
                  <td className="text-right">{currency(d.int)}</td>
                  <td className="text-right">
                    {currency(d.expenses + d.extra + d.debt + d.int)}
                  </td>
                </tr>
              );
            })}
            <tr>
              <th scope="col" className="text-monospace text-center">
                Totales
              </th>
              <td>{Number(totCoef * 100).toFixed(2)}</td>
              <td />
              <td className="text-right">{currency(subtExpenses)}</td>
              <td className="text-right">{currency(subtExtra)}</td>
              <td className="text-right">{currency(subtDebt)}</td>
              <td className="text-right">{currency(subtInt)}</td>
              <td className="text-right">
                {currency(subtExpenses + subtExtra + subtDebt + subtInt)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default ExpensesDetails;
