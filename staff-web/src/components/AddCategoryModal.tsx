import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface AddCategoryModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newCategory: string;
  setNewCategory: (value: string) => void;
  newCategoryDescription: string;
  setNewCategoryDescription: (value: string) => void;
  categoryNameError: string;
  setCategoryNameError: (value: string) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  show,
  onClose,
  onSubmit,
  newCategory,
  setNewCategory,
  newCategoryDescription,
  setNewCategoryDescription,
  categoryNameError,
  setCategoryNameError,
}) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value);
              if (e.target.value.trim() !== "") {
                setCategoryNameError("");
              }
            }}
            placeholder="Enter category name"
          />
          {categoryNameError && (
            <div className="text-danger mt-2">{categoryNameError}</div>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Category Description</Form.Label>
          <Form.Control
            as="textarea"
            value={newCategoryDescription}
            onChange={(e) => setNewCategoryDescription(e.target.value)}
            placeholder="Enter category description (Optional)"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Add Category
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCategoryModal;
