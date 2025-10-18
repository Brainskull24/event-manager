import React from "react";
import useAppStore from "../store/useAppStore";
import CreateEventForm from "../components/CreateEventForm";
import EventCard from "../components/EventCard";
import TimezoneSelector from "../components/TimezoneSelector";
import "./EventManagementPage.css";
import "../components/FormStyles.css";


const EventManagementPage = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  const events = useAppStore((state) => state.events);

  const viewTimezone = useAppStore((state) => state.viewTimezone);
  const setViewTimezone = useAppStore((state) => state.setViewTimezone);

  return (
    <div className="event-management-page">
      <div className="content-grid">
        <div className="create-panel">
          <h1>Create Event</h1>
          <CreateEventForm />
        </div>

        <div className="events-panel">
          <div className="events-panel-header-container flex flex-col items-start justify-between gap-2">
            <h2 className="events-title text-xl font-bold">Events</h2>
            <span className="view-timezone-label">View in Timezone</span>
            <TimezoneSelector value={viewTimezone} setValue={setViewTimezone} />
          </div>

          <div className="event-list">
            {currentUser ? (
              events.length > 0 ? (
                events.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    viewerTimezone={viewTimezone}
                  />
                ))
              ) : (
                <p className="no-events">No events found for this profile.</p>
              )
            ) : (
              <p className="no-events">No events found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagementPage;
