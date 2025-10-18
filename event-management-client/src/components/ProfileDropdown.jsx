import React, { useState, useEffect, useRef } from "react";
import useAppStore from "../store/useAppStore";
import "./ProfileDropdown.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const ProfileDropdown = () => {
  const profiles = useAppStore((state) => state.profiles);
  const currentUser = useAppStore((state) => state.currentUser);
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const createProfile = useAppStore((state) => state.createProfile);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProfileName, setNewProfileName] = useState("");
  const dropdownRef = useRef(null);

  const filteredProfiles = profiles.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (profile) => {
    setCurrentUser(profile);
    setIsOpen(false);
  };

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) {
      toast.info("Profile name cannot be empty.");
      return;
    }
    const newProfile = await createProfile(newProfileName.trim());
    setNewProfileName("");

    if (newProfile) {
      setCurrentUser(newProfile);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        {currentUser ? currentUser.name : "Select current profile..."}
        <FontAwesomeIcon icon={faSort} className="dropdown-icon" />
      </div>

      {isOpen && (
        <div className="dropdown-panel">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search current profile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="profile-list">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((p) => (
                <div
                  key={p._id}
                  className={`profile-item ${
                    currentUser?._id === p._id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectUser(p)}
                >
                  {currentUser?._id === p._id && (
                    <span className="check-mark">✔</span>
                  )}
                  {p.name}
                </div>
              ))
            ) : (
              <div className="no-results">No profiles found.</div>
            )}
          </div>

          <div className="add-profile-section">
            <input
              type="text"
              placeholder="Type user's name..."
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

export default ProfileDropdown;
