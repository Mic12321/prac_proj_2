import React, { useState } from "react";
import { Square, CheckSquare, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
  className?: string;
}

const STATUS_OPTIONS = [
  { label: "Removable", value: "removable" },
  { label: "Has linked items", value: "linked" },
];

const CategorySearchFilter: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  selectedStatuses,
  onStatusChange,
  className = "",
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleToggleStatus = (value: string) => {
    if (selectedStatuses.includes(value)) {
      onStatusChange(selectedStatuses.filter((v) => v !== value));
    } else {
      onStatusChange([...selectedStatuses, value]);
    }
  };

  const handleSelectAllToggle = () => {
    if (selectedStatuses.length === STATUS_OPTIONS.length) {
      onStatusChange([]);
    } else {
      onStatusChange(STATUS_OPTIONS.map((opt) => opt.value));
    }
  };

  const isAllSelected = selectedStatuses.length === STATUS_OPTIONS.length;

  return (
    <div className={`mb-4 d-flex ${className}`}>
      <input
        type="text"
        className="form-control me-2"
        placeholder="Search by category name"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="position-relative">
        <button
          className="btn btn-outline-primary d-flex align-items-center"
          onClick={toggleDropdown}
        >
          Filter Status
          {dropdownOpen ? (
            <ChevronUp className="ms-2" size={16} />
          ) : (
            <ChevronDown className="ms-2" size={16} />
          )}
        </button>

        {dropdownOpen && (
          <div
            className="border rounded mt-2 p-2 bg-white shadow-sm position-absolute end-0"
            style={{ zIndex: 1000, width: "200px" }}
          >
            {/* Select All / Deselect All */}
            <div
              className="form-check mb-2"
              style={{ cursor: "pointer" }}
              onClick={handleSelectAllToggle}
            >
              {isAllSelected ? (
                <CheckSquare size={16} className="me-2" />
              ) : (
                <Square size={16} className="me-2" />
              )}
              {isAllSelected ? "Deselect All" : "Select All"}
            </div>

            {STATUS_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                className="form-check mb-2"
                style={{ cursor: "pointer" }}
                onClick={() => handleToggleStatus(opt.value)}
              >
                {selectedStatuses.includes(opt.value) ? (
                  <CheckSquare size={16} className="me-2" />
                ) : (
                  <Square size={16} className="me-2" />
                )}
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySearchFilter;
