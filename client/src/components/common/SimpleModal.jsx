import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert
} from 'reactstrap';

const closeBtn = <i className="fa fa-times-circle" />;

const SimpleModal = ({ isOpen, toggle, className, title, label, action }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} className={className}>
      <ModalHeader toggle={toggle} close={closeBtn}>
        {title}
      </ModalHeader>
      <ModalBody>
        <React.Fragment>
          <Alert color="danger">
            ¡ATENCIÓN!
            <hr />
            <p>
              <i className="fa fa-exclamation-circle mr-1" />
              Esta acción no se puede desahacer.
            </p>
          </Alert>
        </React.Fragment>
      </ModalBody>
      <ModalFooter>
        <Button
          color={label === 'Guardar' ? 'primary' : 'danger'}
          onClick={action}
        >
          {label}
        </Button>{' '}
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SimpleModal;
