import React from "react";
import { Table, Button } from "react-bootstrap";
import { UserData } from "../services/userService";

interface UserTableProps {
  users: UserData[];
  onEditClick: (user: UserData) => void;
  onDelete: (userId: number) => Promise<void>;
  onResetPassword: (userId: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onEditClick,
  onDelete,
  onResetPassword,
}) => {
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
                  onClick={() => onEditClick(user)}
                >
                  Edit Username
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="me-2"
                  onClick={() => onResetPassword(user.user_id)}
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
    </div>
  );
};

export default UserTable;
