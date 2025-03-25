import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge, Table } from 'react-bootstrap';
import { FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

// Theme configuration
const purpleTheme = {
  gradient: "linear-gradient(45deg, #4B0082, #800080)",
  light: "rgba(75,0,130,0.1)",
  text: "#4B0082",
  border: "1px solid rgba(75,0,130,0.2)"
};

const AllEvents = () => {
  const [type, setType] = useState("Events Scheduled");
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const options = ["Events Scheduled", "All Events"];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events`);
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); 

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center p-5">
      <div className="spinner-border" style={{ color: purpleTheme.text }}></div>
      <span className="ms-3">Loading events...</span>
    </div>
  );
  
  if (error) return (
    <div className="alert alert-danger m-4">{error}</div>
  );

  const filteredEvents = type === "Events Scheduled"
    ? events.filter(event => event.status === "Scheduled")
    : events;

  return (
    <div className="row">
      <div className="col-md-3">
        <div className="list-group shadow-sm">
          {options.map((each) => (
            <motion.button
              key={each}
              className={`list-group-item list-group-item-action fw-bold ${
                type === each ? "active" : ""
              }`}
              onClick={() => setType(each)}
              whileHover={{ scale: 1.02 }}
              style={{
                background: type === each ? purpleTheme.gradient : "white",
                color: type === each ? "white" : purpleTheme.text,
                border: purpleTheme.border
              }}
            >
              <FaCalendarAlt className="me-2" />
              {each}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="col-md-9">
        {events.length === 0 ? (
          <div className="text-center p-5">
            <FaCalendarAlt className="display-1 mb-3" style={{ color: purpleTheme.text }} />
            <p className="text-muted">No events found.</p>
          </div>
        ) : (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Table hover responsive className="shadow-sm rounded overflow-hidden">
              <thead style={{ background: purpleTheme.gradient, color: "white" }}>
                <tr>
                  <th>#</th>
                  <th>Event Name</th>
                  <th>Type</th>
                  <th>Department</th>
                  <th>Scheduled Date</th>
                  <th>Status</th>
                  <th>Report</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, index) => (
                  <tr 
                    key={event.id} 
                    onClick={() => navigate(`/EVENTS/${event.department}/${event.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{index + 1}</td>
                    <td>{event.event_name}</td>
                    <td>{event.event_type}</td>
                    <td>{event.department}</td>
                    <td>{new Date(event.scheduled_date).toLocaleDateString()}</td>
                    <td>
                      <Badge 
                        style={{ 
                          background: event.status === 'Completed' ? '#28a745' : 
                                    event.status === 'Ongoing' ? '#ffc107' : '#dc3545',
                          color: "white"
                        }}
                      >
                        {event.status}
                      </Badge>
                    </td>
                    <td>
                      {event.report_url ? (
                        <a 
                          href={event.report_url} 
                          className="btn btn-sm"
                          style={{ background: purpleTheme.gradient, color: "white" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaFileAlt className="me-1" />
                          View
                        </a>
                      ) : (
                        <span className="text-muted">Not Generated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllEvents;
