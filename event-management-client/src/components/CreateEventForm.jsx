import React, { useState, useEffect } from "react";
import useAppStore from "../store/useAppStore";
import {
  TIMEZONES,
  convertLocalToUTC,
  convertUTCToLocalForm,
} from "../utils/timeUtils";
import "./FormStyles.css";
import ProfileMultiSelector from "./ProfileMultipleSelector";
import TimezoneSelector from "./TimezoneSelector";
import toast from "react-hot-toast";

const DEFAULT_TIME = "08:00";

const CreateEventForm = ({ eventToEdit, onComplete }) => {
  const currentUser = useAppStore((state) => state.currentUser);
  const createEvent = useAppStore((state) => state.createEvent);
  const updateEvent = useAppStore((state) => state.updateEvent);

  const [selectedProfiles, setSelectedProfiles] = useState(
    eventToEdit ? eventToEdit.profiles.map((p) => p._id || p) : []
  );
  const [eventTimezone, setEventTimezone] = useState(
    eventToEdit?.eventTimezone || TIMEZONES[0].value
  );
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState(DEFAULT_TIME);
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState(DEFAULT_TIME);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      const startLocal = convertUTCToLocalForm(
        eventToEdit.startTime,
        eventToEdit.eventTimezone
      );
      const endLocal = convertUTCToLocalForm(
        eventToEdit.endTime,
        eventToEdit.eventTimezone
      );

      setStartDate(startLocal.date);
      setStartTime(startLocal.time);
      setEndDate(endLocal.date);
      setEndTime(endLocal.time);
    }
  }, [eventToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please select a current user.");
      return;
    }
    if (selectedProfiles.length === 0) {
      toast.error("Please select at least one profile.");
      return;
    }

    setIsLoading(true);

    const utcStartTime = convertLocalToUTC(startDate, startTime, eventTimezone);
    const utcEndTime = convertLocalToUTC(endDate, endTime, eventTimezone);

    if (utcEndTime <= utcStartTime) {
      toast.error(
        "End date/time cannot be before or the same as the start date/time."
      );
      setIsLoading(false);
      return;
    }

    const payload = {
      profiles: selectedProfiles,
      eventTimezone,
      startTime: utcStartTime,
      endTime: utcEndTime,
      createdBy: currentUser._id,
    };

    try {
      if (eventToEdit) {
        await updateEvent(eventToEdit._id, payload);
        toast.success("Event updated successfully!");
      } else {
        await createEvent(payload);
        toast.success("Event created successfully!");
      }
      if (onComplete) onComplete();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <div className="form-group">
        <label className="font-semibold">Profiles</label>
        <ProfileMultiSelector
          selectedProfiles={selectedProfiles}
          setSelectedProfiles={setSelectedProfiles}
        />
      </div>

      <div className="form-group">
        <label className="font-semibold">Timezone</label>
        <TimezoneSelector value={eventTimezone} setValue={setEventTimezone} />
      </div>

      <div className="form-group-datetime">
        <label className="font-semibold">Start Date & Time</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            if (new Date(e.target.value) > new Date(endDate)) {
              setEndDate(e.target.value);
            }
          }}
          required
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>

      <div className="form-group-datetime">
        <label className="font-semibold">End Date & Time</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate}
          required
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="submit-button gap-4"
        disabled={isLoading}
      >
        {isLoading ? (
          "Processing..."
        ) : (
          <>
            <span className="">+</span>
            {eventToEdit ? "Update Event" : "Create Event"}
          </>
        )}
      </button>
    </form>
  );
};

export default CreateEventForm;
