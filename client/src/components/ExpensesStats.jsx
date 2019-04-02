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

  return (
    <React.Fragment>
      <div className="">
        <table className="table table-sm">
          <thead>
            <tr>
              <th scope="col">Detalle de gastos ordinarios</th>
              <th scope="col">Totales</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(grouped).map((key, ind) => {
              const subtotal = grouped[key].reduce(
                (acum, current) => (acum += current.ammount),
                0
              );
              return (
                <React.Fragment key={ind}>
                  <tr>
                    <td>
                      <strong>{key}</strong>
                    </td>
                    <td />
                  </tr>
                  {grouped[key].map((exp, ind) => {
                    return (
                      <tr key={ind}>
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
                  <em>{`Total gastos ordinarios`}</em>
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
        <table className="table table-sm">
          <thead>
            <tr>
              <th scope="col">Detalle de gastos extraordinarios</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {expB.map((exp, ind) => {
              return (
                <tr key={ind}>
                  <td>{exp.concept}</td>
                  <td className="text-right">{currency(exp.ammount)}</td>
                </tr>
              );
            })}
            <tr className="table-secondary">
              <td>
                <strong>
                  <em>{`Total gastos extraordinarios`}</em>
                </strong>
              </td>
              <td className="text-right">
                <strong>
                  <em>{currency(totalB)}</em>
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
        <table className="table table-sm">
          <tbody>
            <tr className="table-primary">
              <td>
                <strong>
                  <em>{`Total gastos del período`}</em>
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
