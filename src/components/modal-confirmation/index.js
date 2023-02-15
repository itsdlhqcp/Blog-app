import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function ModalConfirmation({
  show,
  setShow,
  handleConfirmation,
  modalText,
  modalTitle,
}) {
  function hanldeCancel() {
    setShow(false);
  }
  return (
    <>
      <Modal
        show={show}
        onHide={hanldeCancel}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalText}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hanldeCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmation}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
