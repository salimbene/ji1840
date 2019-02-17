import React from 'react';
import PropTypes from 'prop-types';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

const Table = ({ columns, sortColumn, onSort, data, viewOnly, caption }) => {
  return (
    <table className={`table table-hover  ${viewOnly ? 'table-sm' : 'table'}`}>
      {caption ? <caption>{caption}</caption> : null}
      <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
      <TableBody data={data} columns={columns} />
    </table>
  );
};

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  sortColumn: PropTypes.object.isRequired,
  onSort: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired
};

export default Table;
