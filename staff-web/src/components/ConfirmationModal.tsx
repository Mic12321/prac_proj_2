import React from "react";
import { Modal } from "react-bootstrap";

interface ConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
  cancelButtonClass?: string;
  confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  cancelButtonLabel = "Cancel",
  confirmButtonLabel = "Yes, continue",
  cancelButtonClass = "btn btn-danger",
  confirmButtonClass = "btn btn-success",
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <button className={cancelButtonClass} onClick={onHide}>
          {cancelButtonLabel}
        </button>
        <button className={confirmButtonClass} onClick={onConfirm}>
          {confirmButtonLabel}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
