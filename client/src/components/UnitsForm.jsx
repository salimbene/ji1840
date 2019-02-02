import React from 'react';

const UnitsForm = ({ match, history }) => {
  return (
    <React.Fragment>
      <h1>Unit Form {match.params.id}</h1>
      <button
        className="btn btn-primary"
        onClick={() => history.push('/units')}
      >
        Guardar
      </button>
    </React.Fragment>
  );
};

export default UnitsForm;
