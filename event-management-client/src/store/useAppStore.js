import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:5002/api",
});

const useAppStore = create((set, get) => ({
  profiles: [],
  currentUser: null,
  events: [],

  viewTimezone: "America/New_York",
  setViewTimezone: (timezone) => {
    set({ viewTimezone: timezone });
  },

  fetchProfiles: async () => {
    try {
      const res = await api.get("/profiles");
      set({ profiles: res.data });
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  },
  setCurrentUser: (profile) => {
    set({ currentUser: profile });
    if (profile) {
      get().fetchEvents(profile._id);
    }
  },
  createProfile: async (name) => {
    try {
      const res = await api.post("/profiles", { name });
      get().fetchProfiles();
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating profile");
    }
  },

  fetchEvents: async (profileId) => {
    if (!profileId) return set({ events: [] });
    try {
      const res = await api.get(`/events/${profileId}`);
      set({ events: res.data });
    } catch (error) {
      console.error("Error fetching events:", error);
      set({ events: [] });
    }
  },
  createEvent: async (eventData) => {
    try {
      const res = await api.post("/events", eventData);
      get().fetchEvents(get().currentUser._id);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating event");
    }
  },
  updateEvent: async (eventId, eventData) => {
    const promise = api.put(`/events/${eventId}`, eventData);

    toast.promise(promise, {
      loading: "Updating event...",
      success: "Event updated successfully!",
      error: (err) => err.response?.data?.message || "Failed to update event",
    });

    try {
      const res = await promise;
      get().fetchEvents(get().currentUser._id);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  fetchEventLogs: async (eventId) => {
    try {
      const res = await api.get(`/events/${eventId}/logs`);
      return res.data;
    } catch (error) {
      console.error("Error fetching event logs:", error);
      toast.error("Could not fetch event logs.");
      return [];
    }
  },
}));

export default useAppStore;
