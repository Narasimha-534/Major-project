import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  if (loading) return <div className="text-center mt-4">Loading events...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

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
                type === each ? "active bg-warning text-dark" : ""
              }`}
              onClick={() => setType(each)}
              whileHover={{ scale: 1.05 }}
            >
              {each}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="col-md-9">
        {events.length === 0 ? (
          <p className="text-center text-muted">No events found.</p>
        ) : (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Table hover responsive className="shadow-sm rounded overflow-hidden">
              <thead className="bg-warning text-dark">
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
                  <tr key={event.id} onClick={() => navigate(`/EVENTS/${event.department}/${event.id}`)}>
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
                      {event.report_url ? (
                        <a href={event.report_url} className="btn btn-sm btn-dark">
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
