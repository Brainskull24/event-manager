import "./App.css";
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import EventManagementPage from "./pages/EventManagementPage";
import useAppStore from "./store/useAppStore";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";

function App() {
  const fetchProfiles = useAppStore((state) => state.fetchProfiles);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<EventManagementPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            backgroundColor: "var(--color-panel)",
            color: "var(--color-text-dark)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          },
        }}
      />
    </Router>
  );
}

export default App;
