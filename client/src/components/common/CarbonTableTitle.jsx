import React, { Fragment } from 'react';
import BtnNew from './BtnNew';
const CarbonTableTitle = ({
  title,
  helper,
  btnLabel,
  btnClick,
  currentUser
}) => {
  return (
    <Fragment>
      <div className="bx--data-table-header">
        <div className="bx--grid">
          <div className="bx--row">
            <div className="bx--col">
              <h4 className="bx--data-table-header__title">{title}</h4>
              <div className="bx--data-table-header__description">{helper}</div>
            </div>
            <div className="bx--col bx--toolbar-content">
              {currentUser && currentUser.isCouncil && btnLabel && (
                <BtnNew btnClick={btnClick} btnLabel={btnLabel} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CarbonTableTitle;
