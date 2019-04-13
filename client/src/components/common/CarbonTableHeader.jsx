import React, { Component } from 'react';

class CarbonTableHeader extends Component {
  raiseSort = path => {
    const sortColumn = { ...this.props.sortColumn };
    if ((sortColumn.path = path))
      sortColumn.order = sortColumn.order === 'asc' ? 'desc' : 'asc';
    else {
      sortColumn.path = path;
      sortColumn.order = 'asc';
    }
    this.props.onSort(sortColumn);
  };

  renderSortIcon = column => {
    const { sortColumn } = this.props;
    if (column.path !== sortColumn.path) return null;
    if (sortColumn.order === 'asc') return <i className="fa fa-sort-asc" />;
    return <i className="fa fa-sort-desc" />;
  };

  render() {
    return (
      <thead>
        <tr>
          {this.props.columns.map(column => (
            <th key={column.path || column.key}>
              <button
                className="bx--table-sort"
                data-event="sort"
                title="Name"
                onClick={() => this.raiseSort(column.path)}
              >
                <span className="bx--table-header-label">{column.label}</span>
                <svg
                  focusable="false"
                  preserveAspectRatio="xMidYMid meet"
                  // style="will-change: transform;"
                  xmlns="http://www.w3.org/2000/svg"
                  className="bx--table-sort__icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M12.3 9.3l-3.8 3.8V1h-1v12.1L3.7 9.3 3 10l5 5 5-5z" />
                </svg>
                <svg
                  focusable="false"
                  preserveAspectRatio="xMidYMid meet"
                  // style="will-change: transform;"
                  xmlns="http://www.w3.org/2000/svg"
                  className="bx--table-sort__icon-unsorted"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M13.8 10.3L12 12.1V2h-1v10.1l-1.8-1.8-.7.7 3 3 3-3zM4.5 2l-3 3 .7.7L4 3.9V14h1V3.9l1.8 1.8.7-.7z" />
                </svg>
              </button>
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}

export default CarbonTableHeader;
