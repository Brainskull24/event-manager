// src/components/ProfileMultiSelector.jsx
import React, { useState, useEffect, useRef } from "react";
import useAppStore from "../store/useAppStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faCheck } from "@fortawesome/free-solid-svg-icons";
import "./ProfileMultiSelector.css";
// NOTE: ProfileMultiSelector.css will reuse many styles from ProfileDropdown.css

const ProfileMultiSelector = ({ selectedProfiles, setSelectedProfiles }) => {
  const profiles = useAppStore((state) => state.profiles);
  const createProfile = useAppStore((state) => state.createProfile);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProfileName, setNewProfileName] = useState("");
  const dropdownRef = useRef(null);

  const filteredProfiles = profiles.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get names of selected profiles for display
  const selectedNames = selectedProfiles
    .map((id) => profiles.find((p) => p._id === id)?.name)
    .filter((name) => name)
    .join(", ");

  // Toggle selection
  const handleToggleProfile = (profileId) => {
    if (selectedProfiles.includes(profileId)) {
      setSelectedProfiles(selectedProfiles.filter((id) => id !== profileId));
    } else {
      setSelectedProfiles([...selectedProfiles, profileId]);
    }
  };

  // Handle new profile creation
  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) return toast.error("Profile name cannot be empty.");

    const newProfile = await createProfile(newProfileName.trim());
    setNewProfileName("");

    // Automatically select the newly created profile for the event
    if (newProfile) {
      handleToggleProfile(newProfile._id);
    }
  };

  // Close dropdown when clicking outside
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
      className="profile-selector-container input-with-icon"
      ref={dropdownRef}
    >
      {/* The main display */}
      <div
        className="profile-selector-display input-field"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedProfiles.length === 0
          ? "Select profiles..."
          : `${selectedProfiles.length} profiles selected (${selectedNames})`}
      </div>
      <FontAwesomeIcon icon={faSort} className="dropdown-icon" />

      {/* The dropdown content panel */}
      {isOpen && (
        <div className="dropdown-panel">
          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Profile List */}
          <div className="profile-list">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((p) => {
                const isSelected = selectedProfiles.includes(p._id);
                return (
                  <div
                    key={p._id}
                    className={`profile-item ${isSelected ? "selected" : ""}`}
                    onClick={() => handleToggleProfile(p._id)}
                  >
                    <span className="check-mark">
                      {isSelected && <FontAwesomeIcon icon={faCheck} />}
                    </span>
                    {p.name}
                  </div>
                );
              })
            ) : (
              <div className="no-results">No profiles found.</div>
            )}
          </div>

          {/* Add Profile Section */}
          <div className="add-profile-section">
            <input
              type="text"
              placeholder="New profile name"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateProfile()}
            />
            <button onClick={handleCreateProfile} className="add-button-inline">
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMultiSelector;
