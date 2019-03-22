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

const deleteMessage = (
  <p className="lead">Se procederá a eliminar el item seleccionado</p>
);

const SimpleModal = ({
  isOpen,
  toggle,
  className,
  title,
  label,
  action,
  body
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} className={className}>
      <ModalHeader toggle={toggle} close={closeBtn} className="display-5">
        <div className="display-5">{title}</div>
      </ModalHeader>
      <ModalBody>
        <React.Fragment>
          <strong>Atención</strong>
          <i className="fa fa-surprise" />
          {body}
          <Alert color="danger">
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
