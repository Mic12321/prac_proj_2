import React from "react";
import ToastNotification from "./ToastNotification";

interface ConnectionErrorToastNotificationProps {
  show: boolean;
  onClose: () => void;
  message: string;
}

const ConnectionErrorToastNotification: React.FC<
  ConnectionErrorToastNotificationProps
> = ({ show, onClose, message }) => {
  return (
    <ToastNotification
      show={show}
      onClose={onClose}
      message={message}
      variant="danger"
      delay={5000}
    />
  );
};

export default ConnectionErrorToastNotification;
