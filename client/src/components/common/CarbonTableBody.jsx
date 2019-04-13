import React, { Component } from 'react';
import _ from 'lodash';
class CarbonTableBody extends Component {
  renderCell = (item, column) => {
    if (typeof item[column.path] === 'boolean' && !column.key)
      return item[column.path] ? (
        <div className="text-center">
          <i className="fa fa-check-square-o" aria-hidden="true" />
        </div>
      ) : (
        <div className="text-center">
          <i className="fa fa-square-o" aria-hidden="true" />
        </div>
      );
    if (column.content) return column.content(item);
    return _.get(item, column.path);
  };

  createKey = (item, column) => {
    return item._id + column.path || column.key;
  };

  render() {
    const { data, columns } = this.props;

    return (
      <tbody>
        {data.map(item => (
          <tr key={item._id}>
            {columns.map(column => (
              <td key={this.createKey(item, column)}>
                {this.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default CarbonTableBody;
