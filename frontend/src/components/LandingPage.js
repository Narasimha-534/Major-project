import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRegFileAlt, FaCalendarAlt, FaChartBar } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center position-relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #4B0082 0%, #800080 50%, #FF1493 100%)",
        padding: "clamp(1rem, 5vw, 3rem)"
      }}
    >
      {/* Background Elements */}
      <div className="position-absolute w-100 h-100" style={{ overflow: 'hidden', zIndex: 0 }}>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="position-absolute rounded-circle"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: "blur(8px)"
            }}
            animate={{
              y: [0, 30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="position-relative" style={{ zIndex: 1 }}>
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-5"
        >
          <h1 className="display-2 fw-bold mb-4" style={{ 
            color: '#ffffff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '1px'
          }}>
            Welcome to <span style={{ 
              background: 'linear-gradient(to right, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              padding: '0 10px'
            }}>College Report Manager</span>
          </h1>
          <p className="fs-4 mb-5" style={{ 
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Streamline your institution's annual reports, event management, and student performance tracking with our comprehensive solution.
          </p>
        </motion.div>
        
        {/* Feature Cards */}
        <div className="container mb-5">
          <div className="row g-4 justify-content-center">
            {[
              {
                icon: <FaRegFileAlt className="display-4 mb-4" style={{ color: '#00bcd4' }} />,
                title: "Annual Reports",
                description: "Generate comprehensive annual reports for your institution with ease.",
                gradient: "linear-gradient(135deg, #00bcd4 0%, #007b8a 100%)"
              },
              {
                icon: <FaCalendarAlt className="display-4 mb-4" style={{ color: '#4CAF50' }} />,
                title: "Event Management",
                description: "Manage department-wise events and generate detailed event reports.",
                gradient: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)"
              },
              {
                icon: <FaChartBar className="display-4 mb-4" style={{ color: '#ff4081' }} />,
                title: "Student Performance",
                description: "Track and analyze student performance department-wise for better decision-making.",
                gradient: "linear-gradient(135deg, #ff4081 0%, #c51162 100%)"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="col-lg-4 col-md-6 col-sm-12 d-flex"
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="d-flex flex-wrap gap-4 justify-content-center mt-4"
        >
          <Link
            to="/login"
            className="btn btn-lg fw-bold px-5 py-3 shadow-lg position-relative overflow-hidden"
            style={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              border: 'none',
              color: '#000',
              borderRadius: '50px',
              minWidth: '200px'
            }}
          >
            <span className="position-relative z-1">Login Now</span>
          </Link>
          <Link
            to="/register"
            className="btn btn-lg fw-bold px-5 py-3 shadow-lg position-relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)',
              color: '#fff',
              borderRadius: '50px',
              minWidth: '200px'
            }}
          >
            <span className="position-relative z-1">Register</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, description, gradient }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className="h-100 w-100 p-4 rounded-4 shadow-lg d-flex flex-column align-items-center text-center"
      style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}
    >
      <div className="p-3 rounded-circle mb-3" style={{
        background: 'rgba(255,255,255,0.1)'
      }}>
        {icon}
      </div>
      <h2 className="h4 fw-bold mb-3" style={{ color: '#ffffff' }}>{title}</h2>
      <p className="mb-0" style={{ 
        color: 'rgba(255,255,255,0.9)',
        fontSize: '1.1rem',
        lineHeight: '1.6'
      }}>{description}</p>
    </motion.div>
  );
};

export default LandingPage;
