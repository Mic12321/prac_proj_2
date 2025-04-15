import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface EditItemQuantityModalProps {
  show: boolean;
  itemName: string;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onClose: () => void;
  onSave: () => void;
}

const EditItemQuantityModal: React.FC<EditItemQuantityModalProps> = ({
  show,
  itemName,
  quantity,
  onQuantityChange,
  onClose,
  onSave,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Quantity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Item:</strong> {itemName}
        </p>
        <Form.Group>
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            value={quantity}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
            min={0}
            autoFocus
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditItemQuantityModal;
