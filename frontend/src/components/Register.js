import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  FaUser, FaEnvelope, FaLock, 
  FaChalkboardTeacher, FaUserCog, FaUniversity, FaCalendarAlt, 
  FaIdCard, FaUserTie, FaArrowRight, FaRegFileAlt
} from "react-icons/fa";
import { Container, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    department: "CSE",
    studentId: "",
    yearOfStudy: "",
    facultyId: "",
    position: "",
    adminId: "",
    adminLevel: "department",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forceRender, setForceRender] = useState(0);
  const formRef = useRef(null);

  useEffect(() => {
    console.log("Role changed to:", formData.role);
  }, [formData.role]);

  useEffect(() => {
    if (formRef.current) {
      void formRef.current.offsetHeight;
    }
  }, [formData.role, forceRender]);

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    
    if (newRole === "student") {
      setFormData({
        ...formData,
        role: newRole,
        facultyId: "",
        position: "",
        adminId: "",
        adminLevel: "department"
      });
    } else if (newRole === "faculty") {
      setFormData({
        ...formData,
        role: newRole,
        studentId: "",
        yearOfStudy: "",
        adminId: "",
        adminLevel: "department"
      });
    } else if (newRole === "admin") {
      setFormData({
        ...formData,
        role: newRole,
        studentId: "",
        yearOfStudy: "",
        facultyId: "",
        position: ""
      });
    }
    
    setForceRender(prev => prev + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "role") {
      handleRoleChange(e);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/register", formData);
      console.log("Registration response:", response.data);
      
      setTimeout(() => {
      navigate("/login");
      }, 500);
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || "Registration failed. Please try again.");
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

      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 py-5 position-relative" style={{ zIndex: 1 }}>
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="login-container p-0 position-relative overflow-hidden"
          style={{
            width: "100%",
            maxWidth: "1000px",
            borderRadius: "16px",
          }}
        >
          <div className="row g-0 shadow-lg rounded-4 overflow-hidden">
            <div className="col-lg-7 p-0">
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
                  <h2 className="fw-bold mb-2" style={{ 
                    color: '#ffffff',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
                  }}>Create an Account</h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)' }}>Join our platform today</p>
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
                
                <Form 
                  key={`form-${formData.role}-${forceRender}`} 
                  onSubmit={handleSubmit} 
                  ref={formRef}
                >
                  <div className="row">
                    <div className="col-md-6">
                      <motion.div variants={itemVariants} className="mb-3">
                        <Form.Group>
                          <Form.Label style={{ color: 'rgba(255,255,255,0.9)' }}>Username</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text border-0" style={{ 
                              background: 'rgba(255,255,255,0.1)'
                            }}>
                              <FaUser style={{ color: '#FFD700' }} />
                            </span>
                            <Form.Control
                              type="text"
                              name="username"
                              placeholder="johnsmith"
                              value={formData.username}
                              onChange={handleChange}
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
                    </div>

                    <div className="col-md-6">
                      <motion.div variants={itemVariants} className="mb-3">
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
                              name="email"
                              placeholder="you@example.com"
                              value={formData.email}
                              onChange={handleChange}
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
                    </div>
                  </div>

                  <motion.div variants={itemVariants} className="mb-3">
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
                          name="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
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

                  <div className="row">
                    <div className="col-md-6">
                      <motion.div variants={itemVariants} className="mb-3">
                        <Form.Group>
                          <Form.Label style={{ color: 'rgba(255,255,255,0.9)' }}>I am a</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text border-0" style={{ 
                              background: 'rgba(255,255,255,0.1)'
                            }}>
                              <FaUserTie style={{ color: '#FFD700' }} />
                            </span>
                            <Form.Select
                              name="role"
                              value={formData.role}
                              onChange={handleChange}
                              className="form-select border-0"
                              style={{ 
                                background: 'rgba(255,255,255,0.1)',
                                color: 'black',
                                padding: '10px 15px',
                                height: 'auto'
                              }}
                            >
                              <option value="student">Student</option>
                              <option value="faculty">Faculty</option>
                              <option value="admin">Admin</option>
                            </Form.Select>
                          </div>
                        </Form.Group>
                      </motion.div>
                    </div>

                    <div className="col-md-6">
                      <motion.div variants={itemVariants} className="mb-3">
                        <Form.Group>
                          <Form.Label style={{ color: 'rgba(255,255,255,0.9)' }}>Department</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text border-0" style={{ 
                              background: 'rgba(255,255,255,0.1)'
                            }}>
                              <FaUniversity style={{ color: '#FFD700' }} />
                            </span>
                            <Form.Select
                              name="department"
                              value={formData.department}
                              onChange={handleChange}
                              className="form-select border-0"
                              style={{ 
                                background: 'rgba(255,255,255,0.1)',
                                color: 'black',
                                padding: '10px 15px',
                                height: 'auto'
                              }}
                            >
                              <option value="CSE">CSE</option>
                              <option value="IT">IT</option>
                              <option value="EEE">EEE</option>
                              <option value="ECE">ECE</option>
                              <option value="CIV">CIV</option>
                              <option value="MECH">MECH</option>
                            </Form.Select>
                          </div>
                        </Form.Group>
                      </motion.div>
                    </div>
                  </div>
          

                  {formData.role === "student" && (
                    <div className="row" style={{display: 'block', opacity: 1}}>
                      <div className="col-md-6">
                        <motion.div variants={itemVariants} className="mb-3">
                          <Form.Group>
                            <Form.Label style={{ color: 'rgba(255,255,255,0.9)' }}>Student ID</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text border-0" style={{ 
                                background: 'rgba(255,255,255,0.1)'
                              }}>
                                <FaIdCard style={{ color: '#FFD700' }} />
                              </span>
                              <Form.Control
                                type="text"
                                name="studentId"
                                placeholder="S12345"
                                value={formData.studentId}
                                onChange={handleChange}
                                required={formData.role === "student"}
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
                      </div>

                      <div className="col-md-6">
                        <motion.div variants={itemVariants} className="mb-3">
                          <Form.Group>
                            <Form.Label style={{ color: 'rgba(255,255,255,0.9)' }}>Year of Study</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text border-0" style={{ 
                                background: 'rgba(255,255,255,0.1)'
                              }}>
                                <FaCalendarAlt style={{ color: '#FFD700' }} />
                              </span>
                              <Form.Control
                                type="number"
                                name="yearOfStudy"
                                placeholder="1-4"
                                value={formData.yearOfStudy}
                                onChange={handleChange}
                                min="1"
                                max="6"
                                required={formData.role === "student"}
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
                      </div>
                    </div>
                  )}

                  {formData.role === "faculty" && (
                    <div className="row" style={{display: 'block', opacity: 1}}>
                      <div className="col-md-6">
                        <motion.div variants={itemVariants} className="mb-3">
                          <Form.Group>
                            <Form.Label style={{ color: 'rgba(255,255,255,0.9)' }}>Faculty ID</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text border-0" style={{ 
                                background: 'rgba(255,255,255,0.1)'
                              }}>
                                <FaChalkboardTeacher style={{ color: '#FFD700' }} />
                              </span>
                              <Form.Control
                                type="text"
                                name="facultyId"
                                placeholder="F12345"
                                value={formData.facultyId}
                                onChange={handleChange}
                                required={formData.role === "faculty"}
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
                      </div>

                      <div className="col-md-6">
                        <motion.div variants={itemVariants} className="mb-3">
                          <Form.Group>
                            <Form.Label style={{ color: 'rgba(255,255,255,0.9)' }}>Position</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text border-0" style={{ 
                                background: 'rgba(255,255,255,0.1)'
                              }}>
                                <FaUserTie style={{ color: '#FFD700' }} />
                              </span>
                              <Form.Control
                                type="text"
                                name="position"
                                placeholder="Professor"
                                value={formData.position}
                                onChange={handleChange}
                                required={formData.role === "faculty"}
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
                      </div>
                    </div>
                  )}

                  {formData.role === "admin" && (
                    <div className="row" style={{display: 'block', opacity: 1}}>
                      <div className="col-md-6">
                        <motion.div variants={itemVariants} className="mb-3">
                          <Form.Group>
                            <Form.Label style={{ color: 'rgba(255,255,255,0.9)' }}>Admin ID</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text border-0" style={{ 
                                background: 'rgba(255,255,255,0.1)'
                              }}>
                                <FaUserCog style={{ color: '#FFD700' }} />
                              </span>
                              <Form.Control
                                type="text"
                                name="adminId"
                                placeholder="A12345"
                                value={formData.adminId}
                                onChange={handleChange}
                                required={formData.role === "admin"}
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
                      </div>

                      <div className="col-md-6">
                        <motion.div variants={itemVariants} className="mb-3">
                          <Form.Group>
                            <Form.Label style={{ color: 'rgba(255,255,255,0.9)' }}>Admin Level</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text border-0" style={{ 
                                background: 'rgba(255,255,255,0.1)'
                              }}>
                                <FaUniversity style={{ color: '#FFD700' }} />
                              </span>
                              <Form.Select
                                name="adminLevel"
                                value={formData.adminLevel}
                                onChange={handleChange}
                                required={formData.role === "admin"}
                                className="form-select border-0"
                                style={{ 
                                  background: 'rgba(255,255,255,0.1)',
                                  color: 'white',
                                  padding: '10px 15px',
                                  height: 'auto',
                                  appearance: 'auto',
                                  WebkitAppearance: 'menulist',
                                  MozAppearance: 'menulist'
                                }}
                              >
                                <option value="department" style={{color: 'black'}}>Department Level</option>
                                <option value="college" style={{color: 'black'}}>College Level</option>
                              </Form.Select>
                            </div>
                          </Form.Group>
                        </motion.div>
                      </div>
                    </div>
                  )}
                  
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
                          Create Account
                          <FaArrowRight className="ms-2" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="mt-4 text-center">
                    <Link 
                      to="/login" 
                      className="text-decoration-none d-inline-block"
                      style={{ color: 'rgba(255,255,255,0.8)' }}
                    >
                      <motion.span 
                        whileHover={{ 
                          color: '#FFD700',
                          transition: { duration: 0.2 }
                        }}
                      >
                        Already have an account? Sign in
                      </motion.span>
                    </Link>
                  </motion.div>
                </Form>
              </motion.div>
            </div>
            
            <div className="col-lg-5 d-none d-lg-block p-0">
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
                      Create your account to get started
                    </p>
                    <div className="d-flex justify-content-center">
                      <div className="px-4 py-3 rounded-4 mt-3" style={{ 
                        background: 'rgba(255,255,255,0.1)', 
                        backdropFilter: 'blur(5px)',
                        maxWidth: '400px'
                      }}>
                        <p style={{ color: 'rgba(255,255,255,0.9)' }}>
                          "Join our platform and streamline your reporting process with our powerful tools."
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

export default Register;
