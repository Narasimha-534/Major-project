import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Modal, Badge } from "react-bootstrap";
import { FaCalendarAlt, FaFileAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar";

// Simplified styling
const purpleTheme = {
  gradient: "linear-gradient(45deg, #4B0082, #800080)",
  light: "rgba(75,0,130,0.1)",
  text: "#4B0082",
  border: "1px solid rgba(75,0,130,0.2)"
};

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "",
    description: "",
    dynamicFields: [{ key: "", value: "" }]
  });
  const [reportGenerating, setReportGenerating] = useState(false);
  const [reportUrl, setReportUrl] = useState(null);
  const [wordUrl, setWordUrl] = useState(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));

    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events?id=${eventId}`);
        if (!response.ok) throw new Error("Failed to fetch event details");
        
        const data = await response.json();
        setEvent(data[0]);
        if (data[0].report_url) {
          setReportUrl(data[0].report_url);
          setWordUrl(data[0].report_docx_url);
        }
        
        // Pre-fill form data
        setFormData({
          ...formData,
          eventName: data[0].event_name || "",
          eventType: data[0].event_type || "",
          description: data[0].description || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  const handleDynamicFieldChange = (index, field, value) => {
    const updatedFields = [...formData.dynamicFields];
    updatedFields[index][field] = value;
    setFormData({ ...formData, dynamicFields: updatedFields });
  };

  const addDynamicField = () => {
    setFormData({ 
      ...formData, 
      dynamicFields: [...formData.dynamicFields, { key: "", value: "" }] 
    });
  };

  const removeDynamicField = (index) => {
    const updatedFields = [...formData.dynamicFields];
    updatedFields.splice(index, 1);
    setFormData({ ...formData, dynamicFields: updatedFields });
  };

  const handleGenerateReport = async () => {
    setReportGenerating(true);

    const form = new FormData();
    form.append("eventId", eventId);
    form.append("eventName", formData.eventName);
    form.append("eventType", formData.eventType);
    form.append("description", formData.description);
    form.append("dynamicFields", JSON.stringify(formData.dynamicFields));
    
    selectedImages.forEach((image) => {
      form.append("images", image);
    });

    try {
      const response = await fetch("http://localhost:5000/api/generate-report", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      if (data.success) {
        setReportUrl(data.report_url);
        setWordUrl(data.word_url);
      }
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setReportGenerating(false);
      setShowModal(false);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="spinner-border" style={{ color: purpleTheme.text }}></div>
        <span className="ms-3">Loading...</span>
      </div>
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div className="alert alert-danger m-4">{error}</div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="card shadow-sm">
          <div className="card-header" style={{ background: purpleTheme.light }}>
            <h2 className="mb-0" style={{ color: purpleTheme.text }}>
              <FaCalendarAlt className="me-2" />
              Event Details
            </h2>
          </div>
          
          {event && (
            <div className="card-body">
              <h3 style={{ color: purpleTheme.text }}>{event.event_name}</h3>
              
              <div className="d-flex gap-2 mb-3">
                <Badge pill bg="light" text="dark">{event.event_type}</Badge>
                <Badge 
                  pill 
                  bg={event.status === 'Completed' ? 'success' : 
                      event.status === 'Ongoing' ? 'warning' : 'danger'}
                >
                  {event.status}
                </Badge>
              </div>
              
              <p>{event.description}</p>
              
              <div className="row mb-3">
                {event.scheduled_date && (
                  <div className="col-md-6 mb-2">
                    <strong><FaCalendarAlt className="me-1" /> Start Date:</strong> {new Date(event.scheduled_date).toLocaleDateString()}
                  </div>
                )}
                
                {event.end_date && (
                  <div className="col-md-6 mb-2">
                    <strong><FaCalendarAlt className="me-1" /> End Date:</strong> {new Date(event.end_date).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              <hr />
              
              <div className="mb-3">
                <h5 style={{ color: purpleTheme.text }}>
                  <FaFileAlt className="me-2" />
                  Event Report
                </h5>
                
                {reportUrl ? (
                  <div className="d-flex gap-2">
                    <a href={reportUrl} target="_blank" rel="noopener noreferrer" 
                      className="btn btn-sm" style={{ background: purpleTheme.gradient, color: "white" }}>
                      View Report
                    </a>
                    
                    {wordUrl && (
                      <a href={wordUrl} target="_blank" rel="noopener noreferrer" 
                        className="btn btn-sm btn-outline-secondary">
                        Download Word Document
                      </a>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-muted">No report has been generated yet.</p>
                    
                    {userRole === "admin" && (
                      <Button 
                        onClick={() => setShowModal(true)}
                        style={{ background: purpleTheme.gradient, borderColor: "transparent" }}
                        size="sm"
                      >
                        Generate Report
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simplified Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ background: purpleTheme.light }}>
          <Modal.Title>Generate Event Report</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Event Name</Form.Label>
              <Form.Control 
                type="text" 
                name="eventName" 
                value={formData.eventName} 
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Event Type</Form.Label>
              <Form.Control 
                type="text" 
                name="eventType" 
                value={formData.eventType} 
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="description" 
                value={formData.description} 
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Upload Images</Form.Label>
              <Form.Control 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Additional Details</Form.Label>
              
              {formData.dynamicFields.map((field, index) => (
                <div key={index} className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Field Name"
                    value={field.key}
                    onChange={(e) => handleDynamicFieldChange(index, "key", e.target.value)}
                    className="me-2"
                  />
                  <Form.Control
                    type="text"
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => handleDynamicFieldChange(index, "value", e.target.value)}
                    className="me-2"
                  />
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => removeDynamicField(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={addDynamicField}
                className="mt-2"
              >
                + Add Field
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            style={{ background: purpleTheme.gradient, borderColor: "transparent" }}
            onClick={handleGenerateReport} 
            disabled={reportGenerating}
          >
            {reportGenerating ? "Generating..." : "Create Report"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EventDetails;
