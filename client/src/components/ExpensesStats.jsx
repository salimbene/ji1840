import React from 'react';
import _ from 'lodash';
import { currency } from '../utils/formatter';

const ExpensesStats = ({ expenses }) => {
  const { data } = expenses;
  const expA = data.filter(e => e.type === 'A');
  const expB = data.filter(e => e.type === 'B');

  const sorted = _.orderBy(expA, ['category'], ['asc']);
  const grouped = _.groupBy(sorted, 'category');

  const totalA = sorted.reduce((acum, current) => (acum += current.ammount), 0);
  const totalB = expB.reduce((acum, current) => (acum += current.ammount), 0);

  console.log(grouped);
  return (
    <React.Fragment>
      <div className="border border-info rounded shadow-sm p-3 mt-5 bg-white adjust">
        <table class="table table-sm">
          <thead>
            <tr>
              <th scope="col">Detalle expensas ordinarias</th>
              <th scope="col">Totales</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(grouped).map(key => {
              const subtotal = grouped[key].reduce(
                (acum, current) => (acum += current.ammount),
                0
              );
              return (
                <React.Fragment>
                  <tr>
                    <td>
                      <strong>{key}</strong>
                    </td>
                    <td />
                  </tr>
                  {grouped[key].map((exp, ind) => {
                    return (
                      <tr>
                        <td>{exp.concept}</td>
                        <td className="text-right">{currency(exp.ammount)}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td>
                      <mark>
                        <em>{`Total ${key}`}</em>
                      </mark>
                    </td>
                    <td className="text-right">
                      <mark>
                        <em>{currency(subtotal)}</em>
                      </mark>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
            <tr className="table-secondary">
              <td>
                <strong>
                  <em>{`Total expensas ordinarias`}</em>
                </strong>
              </td>
              <td className="text-right">
                <strong>
                  <em>{currency(totalA)}</em>
                </strong>
              </td>
            </tr>
          </tbody>
        </table>

        <table class="table table-sm">
          <thead>
            <tr>
              <th scope="col">Detalle expensas extraordinarias</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {expB.map((exp, ind) => {
              console.log(exp);
              return (
                <tr>
                  <td>{exp.concept}</td>
                  <td className="text-right">{currency(exp.ammount)}</td>
                </tr>
              );
            })}
            <tr className="table-secondary">
              <td>
                <strong>
                  <em>{`Total expensas extraordinarias`}</em>
                </strong>
              </td>
              <td className="text-right">
                <strong>
                  <em>{currency(totalB)}</em>
                </strong>
              </td>
            </tr>
            <tr className="table-primary">
              <td>
                <strong>
                  <em>{`Total expensas`}</em>
                </strong>
              </td>
              <td className="text-right">
                <strong>
                  <em>{currency(totalA + totalB)}</em>
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default ExpensesStats;
