import React, { useState } from "react";
import useAppStore from "../store/useAppStore";
import { displayTimeInUserTz } from "../utils/timeUtils";
import CreateEventForm from "./CreateEventForm";
import Modal from "./Modal"; 
import "./EventCard.css";
import { LuUsersRound } from "react-icons/lu";
import { CiCalendar } from "react-icons/ci";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faFileLines } from "@fortawesome/free-solid-svg-icons";

const EventCard = ({ event, viewerTimezone }) => {
  const profiles = useAppStore((state) => state.profiles);
  const fetchEventLogs = useAppStore((state) => state.fetchEventLogs);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logLoading, setLogLoading] = useState(false);

  const assignedProfileNames = event.profiles
    .map((p) => p.name || "Unknown") 
    .join(", ");

  const startDisplayTime = displayTimeInUserTz(event.startTime, viewerTimezone);
  const endDisplayTime = displayTimeInUserTz(event.endTime, viewerTimezone);

  const createdAtDisplay = displayTimeInUserTz(event.createdAt, viewerTimezone);
  const updatedAtDisplay = displayTimeInUserTz(event.updatedAt, viewerTimezone);

  const handleViewLogs = async () => {
    setIsLogModalOpen(true);
    setLogLoading(true);
    const fetchedLogs = await fetchEventLogs(event._id);
    setLogs(fetchedLogs);
    setLogLoading(false);
  };

  return (
    <div className="event-card">
      {/* TOP SECTION: ASSIGNED PROFILES AND EVENT TZ */}
      <div className="card-top-header">
        <LuUsersRound className="icon-profile-group" />
        <span className="profile-group-names">{assignedProfileNames}</span>
      </div>

      {/* MAIN BODY: START/END TIMES */}
      <div className="card-time-details">
        <div className="time-entry">
          <div className="time-line-icon-group">
            <CiCalendar className="icon-calendar" />
            <span className="time-label">Start:</span>
            <span className="time-value">{startDisplayTime}</span>
          </div>
        </div>

        <div className="time-entry">
          <div className="time-line-icon-group">
            <CiCalendar className="icon-calendar" />
            <span className="time-label">End:</span>
            <span className="time-value">{endDisplayTime}</span>
          </div>
        </div>
      </div>

      {/* FOOTER SECTION: CREATED/UPDATED */}
      <div className="card-footer-meta">
        <p>Created: {createdAtDisplay}</p>
        <p>Updated: {updatedAtDisplay}</p>
      </div>

      {/* ACTIONS */}
      <div className="card-actions w-full grid grid-cols-2">
        <button onClick={() => setIsEditModalOpen(true)} className="edit-btn">
          <FontAwesomeIcon icon={faEdit} className="button-icon" />{" "}
          {/* <--- EDIT ICON */}
          Edit
        </button>
        <button onClick={handleViewLogs} className="log-btn">
          <FontAwesomeIcon icon={faFileLines} className="button-icon" />{" "}
          {/* <--- LOGS ICON */}
          View Logs
        </button>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Event"
      >
        <CreateEventForm
          eventToEdit={event}
          onComplete={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Log History Modal (Bonus) */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Event Update History"
      >
        {logLoading ? (
          <p>Loading update history...</p>
        ) : logs.length === 0 ? (
          <p>No update history yet.</p>
        ) : (
          <div className="log-list">
            {logs.map((log) => (
              <div key={log._id} className="log-item">
                <p className="log-timestamp">
                  {displayTimeInUserTz(log.timestamp, viewerTimezone)}
                  (Updated by:{" "}
                  {log.updaterProfileId &&
                  typeof log.updaterProfileId === "object"
                    ? log.updaterProfileId.name
                    : log.updaterProfileId || "Unknown"}
                  )
                </p>
                {log.changes.map((change, index) => (
                  <p key={index} className="log-message">
                    {change.message}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventCard;
