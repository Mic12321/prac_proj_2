import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface ResetPasswordModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  show,
  onClose,
  onSubmit,
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
}) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={handleFormSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ResetPasswordModal;
