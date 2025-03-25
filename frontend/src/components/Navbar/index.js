import React, { useEffect, useState } from "react";
import { User, Home, FileText, Menu, X, LogOut, Bell } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const Navbar = ({ userRole: propUserRole }) => {
  const [userRole, setRole] = useState(propUserRole || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role);
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("role"); 
    localStorage.removeItem("token");
    sessionStorage.clear();

    // Redirect to login page
    navigate("/login");
  };

  // Animation variants
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <nav className="position-sticky top-0 shadow-lg" style={{ zIndex: 1000 }}>
      <div 
        className="py-3"
        style={{ 
          background: "linear-gradient(135deg, #4B0082 0%, #800080 50%, #FF1493 100%)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
        }}
      >
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            {/* Logo */}
            <Link to={`/dashboard/${userRole}`} className="text-decoration-none">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="d-flex align-items-center"
              >
                <motion.h1 
                  className="m-0 fs-4 fw-bold"
                  style={{ 
                    color: "#FFD700",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.2)"
                  }}
                >
                  Annual Report Generator
                </motion.h1>
              </motion.div>
            </Link>

            {/* Desktop Menu */}
            <div className="d-none d-lg-flex align-items-center">
              <ul className="list-unstyled d-flex mb-0 me-3">
                <NavItem 
                  to={`/dashboard/${userRole}`} 
                  active={location.pathname.includes('/dashboard')}
                  icon={<Home size={18} />}
                  text="Home"
                />
                <NavItem 
                  to="/reports" 
                  active={location.pathname.includes('/reports')}
                  icon={<FileText size={18} />}
                  text="Reports"
                />
                <NavItem 
                  to="/notifications" 
                  active={location.pathname.includes('/notifications')}
                  icon={<Bell size={18} />}
                  text="Notifications"
                  badge={3}
                />
              </ul>

              {/* User Profile Menu */}
              <div className="position-relative">
                <motion.button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="btn d-flex align-items-center px-3 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: "linear-gradient(45deg, #FFD700, #FFA500)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#000",
                    fontWeight: "bold",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
                  }}
                >
                  <User className="me-2" size={18} />
                  <span className="d-none d-md-inline me-1">
                    {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || "User"}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="position-absolute end-0 mt-2 py-2 bg-white rounded-3 shadow-lg"
                      style={{ 
                        minWidth: "200px",
                        zIndex: 1001
                      }}
                    >
                      <div className="px-4 py-2 mb-2 border-bottom">
                        <p className="mb-0 fw-bold">
                          {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || "User"}
                        </p>
                        <small className="text-muted">Role: {userRole || "Guest"}</small>
                      </div>
                      
                      <Link to="/profile" className="dropdown-item py-2 px-4 d-flex align-items-center">
                        <User size={16} className="me-2" />
                        My Profile
                      </Link>
                      
                      <div className="dropdown-divider my-2"></div>
                      
                      <button 
                        onClick={handleLogout}
                        className="dropdown-item py-2 px-4 d-flex align-items-center text-danger"
                      >
                        <LogOut size={16} className="me-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn text-white d-lg-none p-1"
              style={{ background: "transparent", border: "none" }}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="d-lg-none"
            style={{ 
              background: "rgba(255, 255, 255, 0.98)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              overflow: "hidden"
            }}
          >
            <div className="container py-3">
              <motion.div variants={itemVariants} className="py-2 border-bottom">
                <p className="mb-1 fw-bold">Signed in as:</p>
                <p className="mb-0 text-muted">{userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || "User"}</p>
              </motion.div>
              
              <ul className="list-unstyled py-2">
                <MobileNavItem 
                  to={`/dashboard/${userRole}`} 
                  icon={<Home size={20} />}
                  text="Dashboard"
                  variants={itemVariants}
                  active={location.pathname.includes('/dashboard')}
                />
                
                <MobileNavItem 
                  to="/reports" 
                  icon={<FileText size={20} />}
                  text="Reports"
                  variants={itemVariants}
                  active={location.pathname.includes('/reports')}
                />
                
                <MobileNavItem 
                  to="/notifications" 
                  icon={<Bell size={20} />}
                  text="Notifications"
                  variants={itemVariants}
                  active={location.pathname.includes('/notifications')}
                  badge={3}
                />
                
                <motion.li variants={itemVariants} className="border-top mt-3 pt-3">
                  <button 
                    onClick={handleLogout}
                    className="btn btn-danger w-100 d-flex align-items-center justify-content-center py-2"
                  >
                    <LogOut size={20} className="me-2" />
                    Logout
                  </button>
                </motion.li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Desktop Nav Item Component
const NavItem = ({ to, active, icon, text, badge }) => (
  <li className="mx-3">
    <Link 
      to={to} 
      className="text-decoration-none d-flex align-items-center position-relative"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`d-flex align-items-center ${active ? 'fw-bold' : ''}`}
        style={{ 
          color: active ? "#FFD700" : "rgba(255, 255, 255, 0.8)",
        }}
      >
        {icon && <span className="me-2">{icon}</span>}
        <span>{text}</span>
        
        {active && (
          <motion.div 
            layoutId="navIndicator"
            className="position-absolute"
            style={{ 
              height: "3px", 
              background: "#FFD700", 
              width: "100%", 
              bottom: "-8px", 
              borderRadius: "3px"
            }}
          />
        )}
        
        {badge && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {badge}
          </span>
        )}
      </motion.div>
    </Link>
  </li>
);

// Mobile Nav Item Component
const MobileNavItem = ({ to, icon, text, variants, active, badge }) => (
  <motion.li variants={variants} className="mb-3">
    <Link 
      to={to} 
      className="text-decoration-none"
      onClick={() => {
        // Close menu on click (you would need to pass setIsMenuOpen as a prop)
      }}
    >
      <motion.div
        whileHover={{ x: 5 }}
        className="d-flex align-items-center p-2 rounded-3"
        style={{ 
          background: active ? "rgba(75,0,130,0.1)" : "transparent",
          color: active ? "#800080" : "#333"
        }}
      >
        {icon && <span className="me-3">{icon}</span>}
        <span className="fw-medium">{text}</span>
        
        {badge && (
          <span className="ms-auto badge rounded-pill bg-danger">
            {badge}
          </span>
        )}
      </motion.div>
    </Link>
  </motion.li>
);

export default Navbar;
