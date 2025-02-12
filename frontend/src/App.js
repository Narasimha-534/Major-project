import React from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import LandingPage from "./components/LandingPage"
import Register from "./components/Register"
import Login from "./components/Login"
import AdminDashboard from "./components/dashboard/AdminDashboard"
import FacultyDashboard from "./components/dashboard/FacultyDashboard"
import StudentDashboard from "./components/dashboard/StudentDashboard"
import DepartmentEvents from "./components/DepartmentEvents"
import DepartmentStudentPerformance from "./components/DepartmentStudentPerformance"
import DepartmentAchievements from "./components/DepartmentAchievements"
import EventDetails from "./components/EventDetails"
import AchievementDetails from "./components/AchievementDetails"

const ProtectedRoute = ({ element: Element, allowedRoles }) => {
  const isAuthenticated = !!localStorage.getItem("token")
  const userRole = localStorage.getItem("role")

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />
  }

  return Element
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard/admin"
          element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />}
        />
        <Route
          path="/dashboard/faculty"
          element={<ProtectedRoute element={<FacultyDashboard />} allowedRoles={["faculty"]} />}
        />
        <Route
          path="/dashboard/student"
          element={<ProtectedRoute element={<StudentDashboard />} allowedRoles={["student"]} />}
        />
        <Route path="/EVENTS/:dept" element={<DepartmentEvents />} />
        <Route path="/STUDENT PERFORMANCE/:dept" element={<DepartmentStudentPerformance/>} />
        <Route path="/ACHIEVEMENTS/:dept" element={<DepartmentAchievements/>} />
        <Route exact path="/EVENTS/:dept/:eventId" element={<EventDetails/>} />
        <Route exact path="/ACHIEVEMENTS/:dept/:id" element={<AchievementDetails/>} />
      </Routes>
    </Router>
  )
}

export default App

