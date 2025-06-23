import React, { useEffect, useState } from "react";
import {
  registerUser,
  UserRegisterData,
  UserData,
  fetchUsers,
  deleteUser,
  updateUser,
  UserUpdateData,
} from "../services/userService";
import ToastNotification from "../components/ToastNotification";
import UserTable from "../components/UserTable";
import EditUsernameModal from "../components/EditUsernameModal";
import { useAuth } from "../context/AuthContext";
import ResetPasswordModal from "../components/ResetPasswordModal";

const AccountManagement: React.FC = () => {
  const [formData, setFormData] = useState<UserRegisterData>({
    username: "",
    password: "",
    role: "staff",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "info" as "success" | "danger" | "info",
  });
  const [users, setUsers] = useState<UserData[]>([]);
  const { token, logout } = useAuth();

  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    userId: 0,
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      setToast({
        show: true,
        message: "Username and password are required.",
        variant: "danger",
      });
      return;
    }
    if (formData.password !== confirmPassword) {
      setToast({
        show: true,
        message: "Passwords do not match.",
        variant: "danger",
      });
      return;
    }
    if (!token) {
      setToast({
        show: true,
        message: "You must be logged in to create accounts.",
        variant: "danger",
      });
      return;
    }
    setLoading(true);
    try {
      await registerUser(formData, token);
      setToast({
        show: true,
        message: `Staff account "${formData.username}" created successfully!`,
        variant: "success",
      });
      setFormData({ username: "", password: "", role: "staff" });
      setConfirmPassword("");
      loadUsers();
    } catch (err: any) {
      setToast({
        show: true,
        message: err.message || "Failed to create account.",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchUsers(token);
      setUsers(data);
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        logout();
      } else {
        console.error("Failed to fetch users:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (userId: number, update: UserUpdateData) => {
    if (!token) return;
    await updateUser(userId, update, token);
    loadUsers();
  };

  const handleDelete = async (userId: number) => {
    if (!token) return;
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId, token);
      loadUsers();
    }
  };

  const handleResetPassword = (userId: number) => {
    setResetPasswordData({ userId, password: "", confirmPassword: "" });
    setShowResetModal(true);
  };

  const submitResetPassword = async () => {
    const { userId, password, confirmPassword } = resetPasswordData;

    if (!password || !confirmPassword) {
      setToast({
        show: true,
        message: "Both password fields are required.",
        variant: "danger",
      });
      return;
    }

    if (password !== confirmPassword) {
      setToast({
        show: true,
        message: "Passwords do not match.",
        variant: "danger",
      });
      return;
    }

    try {
      await updateUser(userId, { password }, token!);
      setToast({
        show: true,
        message: "Password reset successfully.",
        variant: "success",
      });
      setShowResetModal(false);
    } catch (err: any) {
      setToast({
        show: true,
        message: err.message || "Failed to reset password.",
        variant: "danger",
      });
    }
  };

  const handleEditClick = (user: UserData) => {
    setEditingUser(user);
  };

  const handleSaveUsername = async () => {
    if (editingUser) {
      await handleUpdate(editingUser.user_id, { username: newUsername });
      setEditingUser(null);
    }
  };

  const handleCloseEditModal = () => {
    setEditingUser(null);
  };

  useEffect(() => {
    loadUsers();
  }, [token]);

  return (
    <div className="container mt-4">
      <h2>Account Management (Create Staff Account)</h2>

      <form onSubmit={handleSubmit} className="mt-4 border p-4">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            autoComplete="username"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Staff Account"}
        </button>
      </form>

      <div className="mt-4" />
      <UserTable
        users={users}
        onEditClick={handleEditClick}
        onDelete={handleDelete}
        onResetPassword={handleResetPassword}
      />

      <EditUsernameModal
        show={!!editingUser}
        user={editingUser}
        newUsername={newUsername}
        onUsernameChange={setNewUsername}
        onSave={handleSaveUsername}
        onClose={handleCloseEditModal}
      />

      <ResetPasswordModal
        show={showResetModal}
        onClose={() => setShowResetModal(false)}
        onSubmit={submitResetPassword}
        password={resetPasswordData.password}
        confirmPassword={resetPasswordData.confirmPassword}
        onPasswordChange={(val) =>
          setResetPasswordData((prev) => ({ ...prev, password: val }))
        }
        onConfirmPasswordChange={(val) =>
          setResetPasswordData((prev) => ({ ...prev, confirmPassword: val }))
        }
      />

      <ToastNotification
        show={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        message={toast.message}
        variant={toast.variant}
      />
    </div>
  );
};

export default AccountManagement;
