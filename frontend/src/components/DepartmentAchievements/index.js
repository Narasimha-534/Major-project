import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Navbar';

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
    name: '',
    user_id: '',
    title: '',
    description: '',
    date: '',
    category: '',
    department: dept,
    document_url: ''
  });

  const types = ["faculty", "student"];

  useEffect(() => {
    setRole(localStorage.getItem('role'));

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

    fetchAchievements();
  }, [type, dept]);

  const handleShowForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formattedType = type.toLowerCase(); 
    // console.log("Sending data:", JSON.stringify({ ...formData, type: formattedType }));
  
    try {
      const response = await fetch('http://localhost:5000/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: formattedType }),
      });
  
      const responseData = await response.json();
      console.log("Response received:", responseData);
  
      if (!response.ok) {
        throw new Error(`Failed to add achievement: ${response.statusText}`);
      }
  
      setAchievements([...achievements, responseData]);
      handleCloseForm();
    } catch (err) {
      console.error("Error:", err.message);
      alert(`Error: ${err.message}`);
    }
  };
  
  
  

  if (loading) return <div className="text-center mt-4">Loading achievements...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div>
      <Navbar />
      <h2 className="text-center mt-3">Achievements</h2>
      <div className='container-fluid p-5'>
        <div className='row'>
          <div className="col-md-3 mb-3">
            <div className="list-group shadow-sm">
              {types.map((each) => (
                <motion.button
                  key={each}
                  className={`list-group-item list-group-item-action fw-bold ${type === each ? "active bg-warning text-dark" : ""}`}
                  onClick={() => setType(each.toLowerCase())}
                  whileHover={{ scale: 1.05 }}
                >
                  {each}
                </motion.button>
              ))}
            </div>
          </div>

          <div className='col-md-9'>
            <div className="d-flex justify-content-end align-items-center mb-3">
              {role === "admin" && <Button className='btn btn-warning' onClick={handleShowForm}>Add Achievement</Button>}
            </div>

            {achievements.length === 0 ? (
              <p className="text-center text-muted">No achievements found for {type}.</p>
            ) : (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                <Table hover responsive className="shadow-sm rounded overflow-hidden">
                  <thead className="bg-warning text-dark">
                    <tr>
                      <th>#</th><th>Title</th><th>Name</th><th>Category</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {achievements.map((ach, index) => (
                      <tr key={ach.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/ACHIEVEMENTS/${dept}/${ach.id}`)}>
                        <td>{index + 1}</td>
                        <td>{ach.title}</td>
                        <td>{ach.name}</td>
                        <td>{ach.category}</td>
                        <td>{new Date(ach.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Form for Adding Achievement */}
      <Modal show={showForm} onHide={handleCloseForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Achievement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control type="text" name="user_id" value={formData.user_id} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={formData.date} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleInputChange} required>
                <option value="">Select Category</option>
                <option value="Research">Research</option>
                <option value="Awards">Awards</option>
                <option value="Publications">Publications</option>
                <option value="Others">Others</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Document URL (optional)</Form.Label>
              <Form.Control type="text" name="document_url" value={formData.document_url} onChange={handleInputChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DepartmentAchievements;
