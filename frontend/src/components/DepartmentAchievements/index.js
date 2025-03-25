import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Modal, Button, Form } from 'react-bootstrap';
import { FaTrophy, FaGraduationCap, FaChalkboardTeacher, FaPlus, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Navbar';

// Common styles for reuse
const gradientBg = "linear-gradient(45deg, #4B0082, #800080)";
const gradientText = {
  background: "linear-gradient(45deg, #4B0082, #FF1493)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
};
const lightGradientBg = "linear-gradient(45deg, rgba(75,0,130,0.1), rgba(255,20,147,0.05))";
const purpleBorderStyle = { border: "1px solid rgba(75,0,130,0.2)" };

const DepartmentAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [type, setType] = useState('faculty');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { dept } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', user_id: '', title: '', description: '', 
    date: '', category: '', department: dept, document_url: ''
  });

  const types = ["faculty", "student"];

  useEffect(() => {
    setRole(localStorage.getItem('role'));
    fetchAchievements();
  }, [type, dept]);

  const fetchAchievements = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/achievements?type=${type}&department=${dept}`);
      if (!response.ok) throw new Error('Failed to fetch achievements');
      setAchievements(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: type.toLowerCase() }),
      });
  
      const responseData = await response.json();
      if (!response.ok) throw new Error(`Failed to add achievement: ${response.statusText}`);
      
      setAchievements([...achievements, responseData]);
      setShowForm(false);
    } catch (err) {
      console.error("Error:", err.message);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-vh-100" style={{ background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)" }}>
      <Navbar />
      
      <div className="container-fluid py-4 px-md-5">
        <div className="bg-white shadow rounded-4 p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={gradientText}>
              <FaTrophy className="me-2" />
              {dept} Department Achievements
            </h2>
            
            {role === "admin" && (
              <Button 
                className="d-flex align-items-center"
                style={{ background: gradientBg, border: "none" }}
                onClick={() => setShowForm(true)}
              >
                <FaPlus className="me-2" /> Add Achievement
              </Button>
            )}
          </div>

          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-md-3">
              <div className="bg-white rounded-3 shadow-sm overflow-hidden">
                <div className="p-3 border-bottom" style={{ background: lightGradientBg }}>
                  <h5 className="mb-0 fw-bold" style={{ color: "#4B0082" }}>
                    <FaSearch className="me-2" /> Filter By
                  </h5>
                </div>
                
                <div className="p-2">
                  {types.map(each => (
                    <button
                      key={each}
                      className="w-100 border-0 d-flex align-items-center p-3 mb-2 rounded-3"
                      style={{
                        background: type === each ? gradientBg : "white",
                        color: type === each ? "white" : "#495057",
                      }}
                      onClick={() => setType(each)}
                    >
                      {each === "faculty" ? 
                        <FaChalkboardTeacher className="me-3" /> : 
                        <FaGraduationCap className="me-3" />
                      }
                      <span className="text-capitalize">{each}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-md-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={type}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {loading ? (
                    <div className="text-center p-4">
                      <div className="spinner-border" style={{ color: "#4B0082" }}></div>
                      <p className="mt-3">Loading...</p>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger rounded-3 p-3">{error}</div>
                  ) : achievements.length === 0 ? (
                    <div className="text-center p-4 bg-white rounded-3 shadow-sm">
                      <FaTrophy size={40} style={{ color: "#4B0082", opacity: 0.5 }} className="mb-3" />
                      <h5>No achievements found</h5>
                      <p className="text-muted">No {type} achievements available for {dept} department.</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3 shadow-sm overflow-hidden">
                      <div className="table-responsive">
                        <Table hover className="mb-0">
                          <thead>
                            <tr style={{ background: lightGradientBg }}>
                              <th className="py-3 ps-3">#</th>
                              <th>Title</th>
                              <th>Name</th>
                              <th>Category</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {achievements.map((ach, index) => (
                              <tr 
                                key={ach.id}
                                style={{ cursor: "pointer" }} 
                                onClick={() => navigate(`/ACHIEVEMENTS/${dept}/${ach.id}`)}
                              >
                                <td className="py-3 ps-3">{index + 1}</td>
                                <td className="fw-medium">{ach.title}</td>
                                <td>{ach.name}</td>
                                <td>
                                  <span className="badge rounded-pill px-3 py-2" 
                                    style={{ background: "rgba(75,0,130,0.1)", color: "#4B0082" }}>
                                    {ach.category}
                                  </span>
                                </td>
                                <td>
                                  <FaCalendarAlt className="me-2 text-muted" size={14} />
                                  {new Date(ach.date).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton style={{ background: lightGradientBg, border: "none" }}>
          <Modal.Title style={{ color: "#4B0082" }}>
            <FaPlus className="me-2" /> Add Achievement
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={e => setFormData({...formData, [e.target.name]: e.target.value})}
                  required
                  style={purpleBorderStyle}
                />
              </div>
              <div className="col-md-6 mb-3">
                <Form.Label>User ID</Form.Label>
                <Form.Control
                  name="user_id"
                  value={formData.user_id}
                  onChange={e => setFormData({...formData, [e.target.name]: e.target.value})}
                  required
                  style={purpleBorderStyle}
                />
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={formData.title}
                onChange={e => setFormData({...formData, [e.target.name]: e.target.value})}
                required
                style={purpleBorderStyle}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={e => setFormData({...formData, [e.target.name]: e.target.value})}
                style={purpleBorderStyle}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={e => setFormData({...formData, [e.target.name]: e.target.value})}
                  required
                  style={purpleBorderStyle}
                />
              </div>
              <div className="col-md-6 mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={e => setFormData({...formData, [e.target.name]: e.target.value})}
                  required
                  style={purpleBorderStyle}
                >
                  <option value="">Select Category</option>
                  <option value="Research">Research</option>
                  <option value="Awards">Awards</option>
                  <option value="Publications">Publications</option>
                  <option value="Others">Others</option>
                </Form.Select>
              </div>
            </div>

            <Form.Group className="mb-4">
              <Form.Label>Document URL (optional)</Form.Label>
              <Form.Control
                name="document_url"
                value={formData.document_url}
                onChange={e => setFormData({...formData, [e.target.name]: e.target.value})}
                style={purpleBorderStyle}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                type="submit" 
                className="flex-grow-1"
                style={{ background: gradientBg, border: "none" }}
              >
                Submit
              </Button>
              <Button 
                variant="light" 
                onClick={() => setShowForm(false)}
                style={{ ...purpleBorderStyle, color: "#4B0082" }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DepartmentAchievements;
