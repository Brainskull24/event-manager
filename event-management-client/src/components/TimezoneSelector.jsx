import React, { useState, useEffect, useRef } from "react";
import { TIMEZONES } from "../utils/timeUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import "./TimezoneSelector.css";

const TimezoneSelector = ({ value, setValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredOptions = TIMEZONES.filter(
    (tz) =>
      tz.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tz.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTz = TIMEZONES.find((tz) => tz.value === value);
  const displayLabel = selectedTz ? selectedTz.label : "Select Timezone...";

  const handleSelect = (tz) => {
    setValue(tz.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="timezone-selector-root border bg-gray-100 border-gray-200 p-3 rounded-md"
      ref={dropdownRef}
    >
      <div
        className="input-with-icon input-field timezone-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="timezone-display-label">{displayLabel}</span>
        <FontAwesomeIcon icon={faSort} className="dropdown-icon" />
      </div>

      {isOpen && (
        <div className="timezone-panel">
          <div className="search-bar-tz">
            <input
              type="text"
              placeholder="Search timezones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="timezone-list-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((tz) => (
                <div
                  key={tz.value}
                  className={`timezone-option ${
                    tz.value === value ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(tz)}
                >
                  {tz.label}
                </div>
              ))
            ) : (
              <div className="no-results-tz">No results found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimezoneSelector;
