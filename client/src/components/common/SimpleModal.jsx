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

let paymentMessage;

const SimpleModal = ({
  isOpen,
  toggle,
  className,
  title,
  label,
  action,
  formData
}) => {
  if (formData) {
    paymentMessage = (
      <p className="lead">
        El usuario <mark>{formData.lastname}</mark> posee{' '}
        <mark>${Number(formData.balance).toFixed(2)}</mark>
        en su cuenta. Si confirma la operación se debitará el pago de su cuenta.
      </p>
    );
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} className={className}>
      <ModalHeader toggle={toggle} close={closeBtn}>
        <h1 className="display-4">{title}</h1>
      </ModalHeader>
      <ModalBody>
        <React.Fragment>
          <strong>Atención</strong>
          <i className="fa fa-surprise" />
          {formData ? paymentMessage : deleteMessage}
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
