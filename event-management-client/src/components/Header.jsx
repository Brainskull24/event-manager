import React from "react";
import ProfileDropdown from "./ProfileDropdown";
import "./Header.css";

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo">
        <span className="logo-title"> Event Management </span>
        <span className="logo-description">
          {" "}
          Create and manage events across multiple timezones{" "}
        </span>
      </div>

      <div className="user-controls">
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
