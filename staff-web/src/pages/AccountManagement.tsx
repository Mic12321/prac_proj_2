import React, { useState } from "react";
import { registerUser, UserRegisterData } from "../services/userService";
import ToastNotification from "../components/ToastNotification";

const AccountManagement: React.FC = () => {
  const [formData, setFormData] = useState<UserRegisterData>({
    username: "",
    password: "",
    role: "staff",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: "success" | "danger" | "info";
  }>({ show: false, message: "", variant: "info" });

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

    setLoading(true);
    try {
      await registerUser(formData);
      setToast({
        show: true,
        message: `Staff account "${formData.username}" created successfully!`,
        variant: "success",
      });
      setFormData({ username: "", password: "", role: "staff" });
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

  return (
    <div className="container mt-4">
      <h2>Account Management (Create Staff Account)</h2>

      <form onSubmit={handleSubmit} className="mt-4">
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

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Staff Account"}
        </button>
      </form>

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
