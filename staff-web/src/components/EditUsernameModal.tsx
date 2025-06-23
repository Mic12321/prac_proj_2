import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { UserData } from "../services/userService";

interface EditUsernameModalProps {
  show: boolean;
  user: UserData | null;
  newUsername: string;
  onUsernameChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const EditUsernameModal: React.FC<EditUsernameModalProps> = ({
  show,
  user,
  newUsername,
  onUsernameChange,
  onSave,
  onClose,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Username</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>New Username</Form.Label>
          <Form.Control
            type="text"
            value={newUsername}
            onChange={(e) => onUsernameChange(e.target.value)}
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

export default EditUsernameModal;
