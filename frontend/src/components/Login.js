import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaArrowRight, FaRegFileAlt } from "react-icons/fa";
import { Container, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const response = await axios.post("http://localhost:5000/api/login", { email, password });
      const { token, role, department } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("department", department);
      
      // Delay navigation slightly for animation
      setTimeout(() => {
        navigate(`/dashboard/${role}`);
      }, 500);
      
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <div className="min-vh-100 position-relative overflow-hidden" 
      style={{ 
        background: "linear-gradient(135deg, #4B0082 0%, #800080 50%, #FF1493 100%)"
      }}>
      
      {/* Animated background elements */}
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
      
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 position-relative" style={{ zIndex: 1 }}>
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="login-container p-0 position-relative overflow-hidden"
          style={{
            width: "100%",
            maxWidth: "900px",
            borderRadius: "16px",
          }}
        >
          <div className="row g-0 shadow-lg rounded-4 overflow-hidden">
            {/* Left side - Login Form */}
            <div className="col-lg-6 p-0">
              <motion.div 
                variants={itemVariants}
                className="login-form-container h-100 d-flex flex-column justify-content-center p-4 p-md-5"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRight: "1px solid rgba(255, 255, 255, 0.1)"
                }}
              >
                <motion.div variants={itemVariants} className="mb-4 text-center">
                  <h2 className="fw-bold mb-3" style={{ 
                    color: '#ffffff',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
                  }}>Welcome Back</h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)' }}>Log in to access your dashboard</p>
                </motion.div>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="alert alert-danger py-2 text-center mb-4"
                  >
                    {error}
                  </motion.div>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <motion.div variants={itemVariants} className="mb-4">
                    <Form.Group>
                      <Form.Label style={{ color: 'rgba(255,255,255,0.9)' }}>Email</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text border-0" style={{ 
                          background: 'rgba(255,255,255,0.1)'
                        }}>
                          <FaEnvelope style={{ color: '#FFD700' }} />
                        </span>
                        <Form.Control
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="form-control border-0"
                          style={{ 
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            padding: '10px 15px',
                            height: 'auto'
                          }}
                        />
                      </div>
                    </Form.Group>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="mb-4">
                    <Form.Group>
                      <Form.Label style={{ color: 'rgba(255,255,255,0.9)' }}>Password</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text border-0" style={{ 
                          background: 'rgba(255,255,255,0.1)'
                        }}>
                          <FaLock style={{ color: '#FFD700' }} />
                        </span>
                        <Form.Control
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="form-control border-0"
                          style={{ 
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            padding: '10px 15px',
                            height: 'auto'
                          }}
                        />
                      </div>
                    </Form.Group>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="mt-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="btn w-100 py-3 position-relative d-flex align-items-center justify-content-center"
                      style={{
                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#000',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <>
                          Sign In
                          <FaArrowRight className="ms-2" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </Form>
                
                <motion.div variants={itemVariants} className="mt-4 text-center">
                  <Link 
                    to="/register" 
                    className="text-decoration-none d-inline-block"
                    style={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    <motion.span 
                      whileHover={{ 
                        color: '#FFD700',
                        transition: { duration: 0.2 }
                      }}
                    >
                      Don't have an account? Register here
                    </motion.span>
                  </Link>
                </motion.div>
                
                <motion.div variants={itemVariants} className="mt-4 text-center">
                  <Link 
                    to="/" 
                    className="text-decoration-none d-inline-block"
                    style={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    <motion.span 
                      whileHover={{ 
                        color: '#FFD700',
                        transition: { duration: 0.2 }
                      }}
                    >
                      Back to Home
                    </motion.span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Right side - Image */}
            <div className="col-lg-6 d-none d-lg-block p-0">
              <motion.div 
                variants={itemVariants}
                className="h-100 d-flex justify-content-center align-items-center"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(5px)',
                  overflow: 'hidden'
                }}
              >
                <div className="p-4 text-center" style={{ color: 'white' }}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mb-4"
                  >
                    <div className="display-1 mb-3" style={{ color: '#FFD700' }}>
                      <FaRegFileAlt />
                    </div>
                    <h3 className="mb-3">College Report Manager</h3>
                    <p className="lead mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      Streamline your institution's reporting and analytics
                    </p>
                    <div className="d-flex justify-content-center">
                      <div className="px-4 py-3 rounded-4 mt-3" style={{ 
                        background: 'rgba(255,255,255,0.1)', 
                        backdropFilter: 'blur(5px)',
                        maxWidth: '400px'
                      }}>
                        <p style={{ color: 'rgba(255,255,255,0.9)' }}>
                          "Efficient report generation and data management tools for educational institutions."
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Login;
