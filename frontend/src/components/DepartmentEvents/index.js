import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Table, Badge, Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Navbar';
import './index.css';

const DepartmentEvents = () => {
  const { dept } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [newEvent, setNewEvent] = useState({
    event_name: '',
    description: '',
    start_date: '',
    end_date: '',
    event_type: '',
    department: dept,
  });
  
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setUserRole(localStorage.getItem('role'));

    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events?department=${dept}`);
        if (!response.ok) throw new Error('Failed to fetch events');
        setEvents(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [dept]);

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEvent, status: 'Scheduled' }),
      });
      if (!response.ok) throw new Error('Failed to create event');
      setEvents([...events, await response.json()]);
      setShowModal(false);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center mt-4">Loading events...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Navbar />
      <Container className="mt-4 mb-4">
        <Card className="shadow-lg border-0 rounded p-4 bg-light">
          <Row className="align-items-center mb-3">
            <Col>
              <h1 className="text-dark">Department Events - {dept}</h1>
            </Col>
            {userRole === 'admin' && (
              <Col className="text-end">
                <Button variant="warning" onClick={() => setShowModal(true)}>+ Add Event</Button>
              </Col>
            )}
          </Row>
          {events.length === 0 ? (
            <p className="text-center text-muted">No events found for {dept}.</p>
          ) : (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
              <Table hover responsive className="shadow-sm rounded overflow-hidden">
                <thead className="bg-warning text-dark">
                  <tr>
                    <th>#</th><th>Event Name</th><th>Type</th><th>Department</th><th>Scheduled Date</th><th>Status</th><th>Report</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr key={event.id} onClick={() => navigate(`/EVENTS/${dept}/${event.id}`)}>
                      <td>{index + 1}</td>
                      <td>{event.event_name}</td>
                      <td>{event.event_type}</td>
                      <td>{event.department}</td>
                      <td>{new Date(event.scheduled_date).toLocaleDateString()}</td>
                      <td>
                        <Badge bg={event.status === 'Completed' ? 'success' : event.status === 'Ongoing' ? 'warning' : 'danger'}>
                          {event.status}
                        </Badge>
                      </td>
                      <td>
                        {event.report_url ? <a href={event.report_url} className="btn btn-sm btn-dark">View</a> : <span className="text-muted">Not Generated</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </motion.div>
          )}
        </Card>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Add New Event</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3"><Form.Label>Event Name</Form.Label>
              <Form.Control type="text" name="event_name" value={newEvent.event_name} onChange={handleInputChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Event Type</Form.Label>
              <Form.Select name="event_type" value={newEvent.event_type} onChange={handleInputChange} required>
                <option value="">Select Type</option>
                <option value="seminar">Seminar</option>
                <option value="workshop">Workshop</option>
                <option value="conference">Conference</option>
                <option value="webinar">Webinar</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={newEvent.description} onChange={handleInputChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Start Date</Form.Label>
              <Form.Control type="date" name="start_date" value={newEvent.start_date} onChange={handleInputChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>End Date</Form.Label>
              <Form.Control type="date" name="end_date" value={newEvent.end_date} onChange={handleInputChange} required /></Form.Group>
            <Button variant="warning" type="submit" className="w-100">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default DepartmentEvents;
