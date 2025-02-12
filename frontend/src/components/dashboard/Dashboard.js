import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Department from "../Department";
import Navbar from "../Navbar";
import AllEvents from "../AllEvents"
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Departments");
  const [activeDepartment, setActiveDepartment] = useState("CSE");
  const[userRole,setRole] = useState("");

  const navigate = useNavigate();

  const departments = ["CSE", "IT", "EEE", "ECE", "CIVIL", "MECH"];

  useEffect(() => {
    const role = localStorage.getItem("token");
    const token = localStorage.getItem("token");
    if (role && token) {
      setRole(role);
    }
    else{
      navigate("/login");
    }
  }, [navigate]);

  return (
    <motion.div
      className="min-vh-100 text-dark d-flex flex-column"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Navbar userRole = {userRole}/>
      
      {/* Hero Section */}
      <motion.div 
        className="container d-flex flex-column flex-md-row align-items-center justify-content-between text-dark shadow-lg rounded p-5 overflow-hidden"
      >
        <motion.div 
          className="text-start"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="display-3 fw-bold text-warning">Annual Report Generator</h1>
          <p className="lead">Streamlining Report Management for Educational Institutions</p>
        </motion.div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.img 
            src="https://res.cloudinary.com/dweuu8yiq/image/upload/v1738765338/ANNUAL_REPORT_GENERATOR_3_cci1iw.png" 
            alt="Hero Graphic"
            className="img-fluid w-75"
            animate={{ scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } }}
          />
        </motion.div>
      </motion.div>

      {/* Tabs Section */}
      <div className="bg-warning min-vh-100">
      <div className="container mt-4">
        <ul className="nav nav-pills nav-justified bg-white p-2 rounded shadow-sm">
          {["Departments", "Student Performance", "Events", "Reports"].map((tab) => (
            <motion.li key={tab} className="nav-item" whileHover={{ scale: 1.1 }}>
              <button
                className={`nav-link fw-bold ${activeTab === tab ? "active bg-warning text-dark" : "text-dark"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="container mt-4">
        {activeTab === "Departments" && (
          <div className="row">
            {/* Sidebar */}
            <div className="col-md-3 mb-3">
              <div className="list-group shadow-sm">
                {departments.map((dept) => (
                  <motion.button
                    key={dept}
                    className={`list-group-item list-group-item-action fw-bold ${
                      activeDepartment === dept ? "active bg-warning text-dark" : ""
                    }`}
                    onClick={() => setActiveDepartment(dept)}
                    whileHover={{ scale: 1.05 }}
                  >
                    {dept}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content */}
            <motion.div 
              className="col-md-9"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card bg-white shadow-lg p-4 border-0">
                <Department dept={activeDepartment} />
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === "Events" && (
          <motion.div 
            className="card bg-white shadow-lg p-4 text-center border-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AllEvents />
          </motion.div>
        )}

        {activeTab !== "Departments" && activeTab !== "Events" && (
          <motion.div 
            className="card bg-white shadow-lg p-4 text-center border-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-warning">{activeTab}</h2>
            <p className="text-muted">Content for {activeTab} will be available soon.</p>
          </motion.div>
        )}
      </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;