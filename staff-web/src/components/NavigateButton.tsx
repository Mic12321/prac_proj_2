import React from "react";
import { useNavigate } from "react-router";

interface NavigateButtonProps {
  navUrl: string;
  displayName: string;
}

const NavigateButton: React.FC<NavigateButtonProps> = ({
  navUrl,
  displayName,
}) => {
  const navigate = useNavigate();

  return (
    <button className="btn btn-secondary mb-3" onClick={() => navigate(navUrl)}>
      {displayName}
    </button>
  );
};

export default NavigateButton;
