import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { UserData, UserUpdateData } from "../services/userService";

interface UserTableProps {
  users: UserData[];
  onUpdate: (userId: number, update: UserUpdateData) => Promise<void>;
  onDelete: (userId: number) => Promise<void>;
  onResetPassword: (userId: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onUpdate,
  onDelete,
  onResetPassword,
}) => {
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [newUsername, setNewUsername] = useState("");

  const handleEditClick = (user: UserData) => {
    setEditingUser(user);
    setNewUsername(user.username);
  };

  const handleSave = async () => {
    if (!editingUser) return;
    await onUpdate(editingUser.user_id, { username: newUsername });
    setEditingUser(null);
  };

  return (
    <div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Username</th>
            <th>Created</th>
            <th>Last Login</th>
            <th>Role</th>
            <th>Points</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.username}</td>
              <td>{new Date(user.account_creation).toLocaleString()}</td>
              <td>
                {user.last_login
                  ? new Date(user.last_login).toLocaleString()
                  : "-"}
              </td>
              <td>{user.role}</td>
              <td>{user.total_points}</td>
              <td>
                <Button
                  size="sm"
                  variant="primary"
                  className="me-2"
                  onClick={() => handleEditClick(user)}
                >
                  Edit Username
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="me-2"
                  onClick={() => onResetPassword?.(user.user_id)}
                >
                  Reset Password
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(user.user_id)}
                  disabled={true} // Disable delete button for now
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={!!editingUser} onHide={() => setEditingUser(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>New Username</Form.Label>
            <Form.Control
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditingUser(null)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserTable;
