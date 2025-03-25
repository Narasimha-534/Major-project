import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Department from "../Department";
import Navbar from "../Navbar";
import AllEvents from "../AllEvents";
import AnnualReports from "../AnnualReports";
import { motion, AnimatePresence } from "framer-motion";
import { FaChartLine, FaCalendarAlt, FaFileAlt, FaUniversity, FaLaptopCode, FaNetworkWired, FaBolt, FaMicrochip, FaBuilding, FaCogs, FaChevronRight, FaCheck } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Departments");
  const [activeDepartment, setActiveDepartment] = useState("CSE");
  const [userRole, setRole] = useState("");
  // const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();

  const departments = ["CSE", "IT", "EEE", "ECE", "CIVIL", "MECH"];
  
  // Tab configuration with icons
  const tabs = [
    { id: "Departments", label: "Departments", icon: <FaUniversity /> },
    { id: "Student Performance", label: "Performance", icon: <FaChartLine /> },
    { id: "Events", label: "Events", icon: <FaCalendarAlt /> },
    { id: "Reports", label: "Reports", icon: <FaFileAlt /> }
  ];

  // In your Dashboard component, add this object for department icons
  const departmentIcons = {
    "CSE": <FaLaptopCode />,
    "IT": <FaNetworkWired />,
    "EEE": <FaBolt />,
    "ECE": <FaMicrochip />,
    "CIVIL": <FaBuilding />,
    "MECH": <FaCogs />
  };

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auth check and role setting
  useEffect(() => {
    const checkAuth = async () => {
      // setIsLoading(true);
      const role = localStorage.getItem("role");
      const token = localStorage.getItem("token");
      
      if (role && token) {
        setRole(role);
      } else {
        navigate("/login");
      }
      
      // setTimeout(() => setIsLoading(false), 800); // Add short delay for animation effect
    };
    
    checkAuth();
  }, [navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 200 }
    }
  };

  // if (isLoading) {
  //   return (
  //     <div className="min-vh-100 d-flex justify-content-center align-items-center" 
  //       style={{ 
  //         background: "linear-gradient(135deg, #4B0082 0%, #800080 50%, #FF1493 100%)"
  //       }}>
  //       <div className="text-center text-white">
  //         <div className="spinner-border" role="status">
  //           <span className="visually-hidden">Loading...</span>
  //         </div>
  //         <h4 className="mt-3">Loading Dashboard...</h4>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <motion.div
      className="min-vh-100 d-flex flex-column"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ 
        background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)",
        overflowX: "hidden"
      }}
    >
      <Navbar userRole={userRole} />
      
      {/* Hero Section */}
      {/* Enhanced Hero Section */}
<div className="container-fluid py-4 px-3 px-md-5">
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
    className="position-relative"
    style={{ overflow: "hidden" }}
  >
    {/* Animated background elements */}
    <div className="position-absolute w-100 h-100" style={{ zIndex: 0 }}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="position-absolute rounded-circle"
          style={{
            background: "linear-gradient(135deg, rgba(75,0,130,0.2), rgba(255,20,147,0.1))",
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: "blur(50px)",
            zIndex: -1
          }}
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>

    <motion.div
      className="row align-items-center justify-content-between bg-white shadow-lg rounded-4 p-3 p-md-5 mx-0 mx-md-2 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      style={{ 
        backdropFilter: "blur(10px)",
        background: "rgba(255, 255, 255, 0.85)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        position: "relative",
        zIndex: 1
      }}
    >
      {/* Decorative elements */}
      <div className="position-absolute" style={{ top: "-50px", right: "-50px", zIndex: -1 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "2px dashed rgba(75,0,130,0.1)",
          }}
        />
      </div>
      <div className="position-absolute" style={{ bottom: "-30px", left: "-30px", zIndex: -1 }}>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            border: "2px dashed rgba(255,20,147,0.1)",
          }}
        />
      </div>

      {/* Left content */}
      <motion.div 
        className="col-12 col-lg-6 text-center text-lg-start mb-5 mb-lg-0"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.div
          className="badge px-3 py-2 mb-4 d-inline-flex align-items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            background: "linear-gradient(45deg, rgba(75,0,130,0.1), rgba(255,20,147,0.1))",
            borderRadius: "30px",
            border: "1px solid rgba(75,0,130,0.2)",
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="me-2 text-purple"
            role="img"
            aria-label="sparkle"
          >
            ✨
          </motion.span>
          <span className="fw-medium" style={{ color: "#4B0082" }}>Education Management Simplified</span>
        </motion.div>

        <motion.h1 
          className="display-4 fw-bold lh-sm mb-3"
          style={{ 
            background: "linear-gradient(45deg, #4B0082, #FF1493)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
          }}
        >
          Annual Report
          <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Generator
          </motion.span>
        </motion.h1>

        <motion.p 
          className="lead text-secondary mt-3 mb-4 pe-lg-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Streamlining Report Management for Educational Institutions with advanced analytics and beautiful presentations.
        </motion.p>

        <motion.div
          className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-3 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(75,0,130,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-lg px-4 py-3 rounded-pill d-inline-flex align-items-center"
            style={{ 
              background: "linear-gradient(45deg, #4B0082, #800080)",
              border: "none",
              color: "white",
              boxShadow: "0 4px 15px rgba(75,0,130,0.4)"
            }}
            onClick={() => setActiveTab("Reports")}
          >
            <span className="me-2 fw-bold">Get Started</span>
            <FaFileAlt />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-lg px-4 py-3 rounded-pill d-inline-flex align-items-center"
            style={{ 
              background: "rgba(75,0,130,0.1)",
              border: "1px solid rgba(75,0,130,0.2)",
              color: "#4B0082"
            }}
            onClick={() => setActiveTab("Departments")}
          >
            <span className="me-2">View Departments</span>
            <FaUniversity />
          </motion.button>
        </motion.div>
      </motion.div>
      
      {/* Right content with enhanced image */}
      <motion.div
        className="col-12 col-lg-6 text-center position-relative"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        {/* Floating elements around the image */}
        <motion.div
          className="position-absolute d-none d-lg-block"
          style={{ top: "10%", right: "5%", zIndex: 2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white rounded-4 shadow-lg p-3"
            style={{ width: "120px" }}
          >
            <div className="d-flex align-items-center justify-content-center mb-2">
              <FaChartLine className="text-success me-2" />
              <span className="fw-bold">+24%</span>
            </div>
            <div className="text-muted small">Efficiency</div>
          </motion.div>
        </motion.div>
        
        <motion.div
          className="position-absolute d-none d-lg-block"
          style={{ bottom: "15%", left: "0", zIndex: 2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="bg-white rounded-4 shadow-lg p-3"
            style={{ width: "130px" }}
          >
            <div className="d-flex align-items-center justify-content-center mb-2">
              <FaCalendarAlt className="text-primary me-2" />
              <span className="fw-bold">45 min</span>
            </div>
            <div className="text-muted small">Time Saved</div>
          </motion.div>
        </motion.div>
        
        {/* Main image with enhanced effects */}
        <motion.div
          className="position-relative p-3 rounded-4 mx-auto"
          style={{ 
            maxWidth: "450px",
            background: "linear-gradient(45deg, rgba(75,0,130,0.1), rgba(255,20,147,0.05))",
            border: "1px solid rgba(255,255,255,0.3)",
            overflow: "hidden"
          }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.div
            className="position-relative"
            style={{ zIndex: 2 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.img 
              src="https://res.cloudinary.com/dweuu8yiq/image/upload/v1738765338/ANNUAL_REPORT_GENERATOR_3_cci1iw.png" 
              alt="Report Generator"
              className="img-fluid rounded-4 shadow"
              style={{ 
                maxHeight: "350px",
                filter: "drop-shadow(0 10px 20px rgba(75,0,130,0.3))"
              }}
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.01, 1],
              }}
              transition={{ 
                y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                scale: { repeat: Infinity, duration: 5, ease: "easeInOut" },
              }}
            />
            
            {/* Image glossy overlay */}
            <motion.div 
              className="position-absolute top-0 start-0 w-100 h-100 rounded-4"
              style={{
                background: "linear-gradient(120deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%)",
                zIndex: 3
              }}
            />
          </motion.div>
          
          {/* Decorative elements */}
          <motion.div
            className="position-absolute"
            style={{ top: "-20px", right: "-20px", zIndex: 1 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div style={{ 
              width: "100px", 
              height: "100px", 
              borderRadius: "50%",
              border: "2px dashed rgba(75,0,130,0.2)" 
            }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  </motion.div>
</div>

      {/* Tabs Section */}
      <div className="container-fluid px-3 px-md-5 mb-4">
        <motion.div 
          className="bg-white rounded-4 shadow-sm p-2"
          variants={itemVariants}
        >
          <div className={`nav nav-pills ${isMobile ? "" : "nav-justified"}`} 
               style={isMobile ? { overflowX: "auto", flexWrap: "nowrap", whiteSpace: "nowrap" } : {}}>
            {tabs.map((tab) => (
              <motion.div key={tab.id} className="nav-item" whileHover={{ scale: 1.05 }}>
                <button
                  className={`nav-link ${isMobile ? "px-3" : "px-4"} py-3 ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: activeTab === tab.id ? 
                      "linear-gradient(45deg, #4B0082, #800080)" : "transparent",
                    color: activeTab === tab.id ? "white" : "#495057",
                    border: "none",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="container-fluid px-3 px-md-5 mb-5 flex-grow-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-100"
          >
            {activeTab === "Departments" && (
              <div className="row g-4">
                {/* Improved Departments Sidebar */}
                <div className={`col-12 ${isMobile ? "mb-4" : "col-md-3"}`}>
                  {isMobile ? (
                    // Mobile view - Dropdown selector
                    <motion.div 
                      className="bg-white rounded-4 shadow-sm p-3 mb-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="form-label fw-bold mb-2" style={{ color: "#4B0082" }}>
                        <FaUniversity className="me-2" /> Select Department
                      </label>
                      <select
                        className="form-select py-3 px-3"
                        value={activeDepartment}
                        onChange={(e) => setActiveDepartment(e.target.value)}
                        style={{
                          background: "linear-gradient(to right, rgba(75,0,130,0.05), rgba(255,20,147,0.02))",
                          borderRadius: "12px",
                          border: "1px solid rgba(75,0,130,0.1)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                          fontWeight: "bold",
                          color: "#4B0082"
                        }}
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </motion.div>
                  ) : (
                    // Desktop view - Enhanced sidebar
                    <motion.div 
                      className="bg-white rounded-4 shadow-sm overflow-hidden"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="p-3 border-bottom" style={{ 
                        background: "linear-gradient(45deg, rgba(75,0,130,0.1), rgba(255,20,147,0.05))"
                      }}>
                        <h5 className="mb-0 fw-bold d-flex align-items-center" style={{ color: "#4B0082" }}>
                          <FaUniversity className="me-2" /> Departments
                        </h5>
                      </div>
                      
                      <div className="p-2">
                        {departments.map((dept, index) => (
                          <motion.div 
                            key={dept}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="mb-2"
                          >
                            <motion.button
                              whileHover={{ 
                                scale: 1.02, 
                                boxShadow: activeDepartment !== dept ? "0 3px 10px rgba(0,0,0,0.05)" : "none"
                              }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setActiveDepartment(dept)}
                              className={`w-100 border-0 d-flex align-items-center justify-content-between p-3 rounded-3`}
                              style={{
                                background: activeDepartment === dept 
                                  ? "linear-gradient(45deg, #4B0082, #800080)" 
                                  : "white",
                                color: activeDepartment === dept ? "white" : "#495057",
                                boxShadow: activeDepartment === dept 
                                  ? "0 4px 15px rgba(75,0,130,0.3)" 
                                  : "none",
                                transition: "all 0.3s ease"
                              }}
                            >
                              <div className="d-flex align-items-center">
                                <div className="me-3" style={{ 
                                  width: "28px", 
                                  height: "28px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}>
                                  {departmentIcons[dept]}
                                </div>
                                <span className="fw-medium">{dept}</span>
                              </div>
                              
                              {activeDepartment === dept && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: "spring", stiffness: 500 }}
                                >
                                  <FaCheck />
                                </motion.div>
                              )}
                              
                              {activeDepartment !== dept && (
                                <FaChevronRight style={{ opacity: 0.3 }} />
                              )}
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                      
                      <motion.div 
                        className="p-3 mt-2 mx-2 mb-2 rounded-3 d-flex align-items-center"
                        style={{ 
                          background: "linear-gradient(to right, rgba(75,0,130,0.05), rgba(255,20,147,0.02))",
                          border: "1px dashed rgba(75,0,130,0.1)"
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div 
                          className="me-3 d-flex align-items-center justify-content-center rounded-circle"
                          style={{ 
                            width: "32px", 
                            height: "32px", 
                            background: "rgba(75,0,130,0.1)",
                            color: "#4B0082"
                          }}
                        >
                          <FaUniversity size={14} />
                        </div>
                        <div>
                          <p className="mb-0 small text-muted">
                            View detailed information about each department
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </div>

                {/* Department Content */}
                <div className={`col-12 ${isMobile ? "" : "col-md-9"}`}>
                  <motion.div 
                    className="bg-white rounded-4 shadow p-4 h-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Department dept={activeDepartment} />
                  </motion.div>
                </div>
              </div>
            )}

            {activeTab === "Events" && (
              <motion.div 
                className="bg-white rounded-4 shadow p-4 h-100"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AllEvents />
              </motion.div>
            )}

            {activeTab === "Reports" && (
              <motion.div 
                className="bg-white rounded-4 shadow p-4 h-100"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnnualReports userRole={userRole} />
              </motion.div>
            )}

            {activeTab === "Student Performance" && (
              <motion.div 
                className="bg-white rounded-4 shadow p-4 text-center h-100"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <h2 style={{ 
                    background: "linear-gradient(45deg, #4B0082, #FF1493)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}>
                    Student Performance Analytics
                  </h2>
                  <div className="row justify-content-center my-5">
                    <div className="col-md-8">
                      <div className="alert alert-info p-4">
                        <FaChartLine className="display-4 mb-3" />
                        <p className="lead">Performance analytics module coming soon.</p>
                        <p className="text-muted">Our team is working on bringing you comprehensive student performance metrics and visualizations.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Footer */}
      <motion.footer 
        className="bg-dark text-white text-center py-3"
        variants={itemVariants}
      >
        <small>© 2023 Annual Report Generator. All rights reserved.</small>
      </motion.footer>
    </motion.div>
  );
};

export default Dashboard;