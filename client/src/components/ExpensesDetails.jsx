import React from 'react';
import _ from 'lodash';
import { currency } from '../utils/formatter';

const headers = [
  'Unidad',
  'Coef.',
  'Propietario',
  'Importe',
  'Deuda',
  'Interés',
  'Importe',
  'Deuda',
  'Interés',
  'Total'
];

const ExpensesDetails = ({ details, period }) => {
  const sorted = _.sortBy(details, 'model.label', 'asc');

  const subtExpenseA = sorted.reduce(
    (acum, current) => (acum += current.expenseA),
    0
  );
  const subtDebtA = sorted.reduce(
    (acum, current) => (acum += current.debtA),
    0
  );
  const subtIntA = sorted.reduce((acum, current) => (acum += current.intA), 0);

  const subtExpenseB = sorted.reduce(
    (acum, current) => (acum += current.expenseB),
    0
  );
  const subtDebtB = sorted.reduce(
    (acum, current) => (acum += current.debtB),
    0
  );
  const subtIntB = sorted.reduce((acum, current) => (acum += current.intB), 0);

  const total =
    subtExpenseA + subtDebtA + subtIntA + subtExpenseB + subtDebtB + subtIntB;
  const totCoef = sorted.reduce(
    (acum, current) => (acum += current.model.coefficient),
    0
  );

  return (
    <React.Fragment>
      <div className="mt-5">
        <table className="table table-sm table-hover table-10">
          <caption>{`Expensas ${period}`}</caption>
          <thead>
            <tr>
              <th colSpan="3">{`Detalle de expensas del período ${period}`}</th>
              <th
                colSpan="3"
                className="text-monospace text-center table-active"
              >
                Expensas A
              </th>
              <th
                colSpan="3"
                className="text-monospace text-center table-secondary"
              >
                Expensas B
              </th>
              <th />
            </tr>
          </thead>
          <thead>
            <tr>
              {headers.map((header, ind) => (
                <th
                  scope="col"
                  key={ind}
                  className="text-monospace text-center"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((d, ind) => {
              const expenseTotal =
                d.expenseA + d.debtA + d.intA + d.expenseB + d.debtB + d.intB;
              return (
                <tr key={ind}>
                  <th scope="col">{d.model.label}</th>
                  <td className="text-monospace text-center">
                    {Number(d.model.coefficient * 100).toFixed(2)}
                  </td>
                  <td>{d.model.landlord.lastname}</td>
                  <td className="text-monospace text-right table-active">
                    {currency(d.expenseA)}
                  </td>
                  <td className="text-monospace text-right table-active">
                    {currency(d.debtA)}
                  </td>
                  <td className="text-monospace text-right table-active">
                    {currency(d.intA)}
                  </td>
                  <td className="text-monospace text-right table-secondary">
                    {currency(d.expenseB)}
                  </td>
                  <td className="text-monospace text-right table-secondary">
                    {currency(d.debtB)}
                  </td>
                  <td className="text-monospace text-right table-secondary">
                    {currency(d.intB)}
                  </td>
                  <td className="text-monospace text-right">
                    {currency(expenseTotal)}
                  </td>
                </tr>
              );
            })}
            <tr>
              <th scope="col" className="text-monospace">
                Totales
              </th>
              <td>{Number(totCoef * 100).toFixed(2)}</td>
              <td />
              <td className="text-right table-active">
                {currency(subtExpenseA)}
              </td>
              <td className="text-right table-active">{currency(subtDebtA)}</td>
              <td className="text-right table-active">{currency(subtIntA)}</td>
              <td className="text-right table-secondary">
                {currency(subtExpenseB)}
              </td>
              <td className="text-right table-secondary">
                {currency(subtDebtB)}
              </td>
              <td className="text-right table-secondary">
                {currency(subtIntB)}
              </td>
              <td className="text-right">{currency(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default ExpensesDetails;
