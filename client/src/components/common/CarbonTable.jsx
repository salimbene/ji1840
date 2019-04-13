import React from 'react';
import PropTypes from 'prop-types';
import CarbonTableHeader from './CarbonTableHeader';
import CarbonTableBody from './CarbonTableBody';
import CarbonTablePagination from './CarbonTablePagination';
import CarbonTableTitle from './CarbonTableTitle';

const CarbonTable = ({
  columns,
  sortColumn,
  onSort,
  data,
  btnClick,
  ...rest
}) => {
  return (
    <div className="bx--data-table-container " data-table>
      <CarbonTableTitle
        title="Usuarios"
        btnLabel="Registrar usuario"
        btnClick={btnClick}
      />
      <table className="bx--data-table     bx--data-table--sort ">
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
