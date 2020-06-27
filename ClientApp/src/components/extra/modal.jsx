import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

const ModalExample = (props) => {
  const {
    buttonLabel,
    className,
    text,
    func
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = (e) => {
    e.preventDefault();
    setModal(!modal);
  }

  return (
    <div>
      <a href="/" className="text-danger" onClick={toggle}>{buttonLabel}</a>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalBody>{text}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => { func(); toggle(e); }}>Да</Button>{' '}
          <Button color="secondary" onClick={toggle}>Нет</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalExample;