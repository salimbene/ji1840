import React from 'react';
import PropTypes from 'prop-types';
import CarbonTableHeader from './CarbonTableHeader';
import CarbonTableBody from './CarbonTableBody';

const CarbonTable = ({
  columns,
  sortColumn,
  onSort,
  data,
  btnClick,
  currentUser,
  ...rest
}) => {
  return (
    <div className="bx--data-table-container cc--mb25" data-table>
      <table className="bx--data-table bx--data-table--sort">
        <CarbonTableHeader
          columns={columns}
          sortColumn={sortColumn}
          onSort={onSort}
        />
        <CarbonTableBody data={data} columns={columns} />
      </table>
    </div>
  );
};

CarbonTable.propTypes = {
  columns: PropTypes.array.isRequired,
  sortColumn: PropTypes.object.isRequired,
  onSort: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired
};

export default CarbonTable;
