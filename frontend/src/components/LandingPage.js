import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRegFileAlt, FaCalendarAlt, FaChartBar } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css'

const LandingPage = () => {
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-gradient p-5 text-light" style={{ background: "linear-gradient(to bottom right, #4B0082, #800080, #FF1493)" }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-5"
      >
        <h1 className="display-3 fw-bold mb-3 text-shadow text-secondary">
          Welcome to <span className="text-warning">College Report Manager</span>
        </h1>
        <p className="fs-4 opacity-90 w-75 mx-auto text-dark">
          Streamline your institution’s annual reports, event management, and student performance tracking.
        </p>
      </motion.div>
      
      {/* Feature Cards */}
      <div className="container mb-5">
        <div className="row g-4 justify-content-center">
          <FeatureCard
            icon={<FaRegFileAlt className="display-4 mb-5 text-primary" />}
            title="Annual Reports"
            description="Generate comprehensive annual reports for your institution with ease."
            className="m-5 margin_assign"
          />
          <FeatureCard
            icon={<FaCalendarAlt className="display-4 mb-5 text-secondary" />}
            title="Event Management"
            description="Manage department-wise events and generate detailed event reports."
            className="m-5 margin_assign"
          />
          <FeatureCard
            icon={<FaChartBar className="display-4 mb-5 text-danger" />}
            title="Student Performance"
            description="Track and analyze student performance department-wise for better decision-making."
            className="m-5 margin_assign"
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="d-flex gap-4 mt-4"
      >
        <Link
          to="/login"
          className="btn btn-warning btn-lg fw-bold px-5 shadow-lg"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="btn btn-outline-dark btn-lg fw-bold px-5 shadow-lg"
        >
          Register
        </Link>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      className="col-lg-3 col-md-6 d-flex flex-column align-items-center text-center p-5 bg-dark bg-opacity-75 rounded-4 shadow-lg text-light m-2"
    >
      {icon}
      <h2 className="h3 fw-semibold mb-3">{title}</h2>
      <p className="opacity-85 fs-5">{description}</p>
    </motion.div>
  );
};

export default LandingPage;
