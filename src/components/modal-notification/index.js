import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function ModalNotification({
  show,
  setShow,
  handleClose,
  modalText,
  modalTitle,
}) {
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalText}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
