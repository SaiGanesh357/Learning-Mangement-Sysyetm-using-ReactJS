// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Dashboard from "./components/Dashboard";
import BatchList from "./components/Batches/BatchList";
import BatchDetails from "./components/Batches/BatchDetails";
import StudentList from "./components/Students/StudentList";
import StudentDetails from "./components/Students/StudentDetails";
import MarkList from "./components/Marks/MarkList";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = window.location.pathname;
  const hideNavbar = ["/login", "/register"].includes(location);

  return (
    <Router>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/batches"
          element={
            <ProtectedRoute>
              <BatchList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/batches/:id"
          element={
            <ProtectedRoute>
              <BatchDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <StudentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/:id"
          element={
            <ProtectedRoute>
              <StudentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marks"
          element={
            <ProtectedRoute>
              <MarkList />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
