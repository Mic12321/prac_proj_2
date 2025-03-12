import React from "react";
import { Toast } from "react-bootstrap";

interface ToastProps {
  show: boolean;
  onClose: () => void;
  message: string;
  variant?: "success" | "danger" | "warning" | "info";
  delay?: number;
}

const ToastNotification: React.FC<ToastProps> = ({
  show,
  onClose,
  message,
  variant = "info",
  delay = 5000,
}) => {
  return (
    <Toast
      show={show}
      onClose={onClose}
      delay={delay}
      autohide
      bg={variant}
      className="position-fixed bottom-0 end-0 m-3"
    >
      <Toast.Header>
        <strong className="me-auto">
          {variant === "success" && "Success"}
          {variant === "danger" && "Error"}
          {variant === "warning" && "Warning"}
          {variant === "info" && "Info"}
        </strong>
      </Toast.Header>
      <Toast.Body className="text-white">{message}</Toast.Body>
    </Toast>
  );
};

export default ToastNotification;
