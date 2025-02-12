import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar";

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
    dynamicFields: [{ key: "", value: "" }],
  });
  const [reportGenerating, setReportGenerating] = useState(false);
  const [reportUrl, setReportUrl] = useState(null);
  const [wordUrl, setWordUrl] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);

    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events?id=${eventId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }
        const data = await response.json();
        setEvent(data[0]);
        if (data[0].report_url) {
          setReportUrl(data[0].report_url);
          setWordUrl(data[0].report_docx_url)
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDynamicFieldChange = (index, field, value) => {
    const updatedFields = [...formData.dynamicFields];
    updatedFields[index][field] = value;
    setFormData({ ...formData, dynamicFields: updatedFields });
  };

  const addDynamicField = () => {
    setFormData({ ...formData, dynamicFields: [...formData.dynamicFields, { key: "", value: "" }] });
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
    console.log("Sending dynamicFields:", JSON.stringify(formData.dynamicFields));

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

  if (loading) return <div className="text-center mt-4">Loading event details...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="container mt-4  p-5 card shadow-lg">
        <h1 className="main text-primary">Event Details</h1>

        {event && (
          <div>
            <h3>{event.event_name}</h3>
            <p><strong>Description:</strong> {event.description}</p>
            {event.scheduled_date && <p><strong>Start Date:</strong> {new Date(event.scheduled_date).toLocaleDateString()}</p>}
            {event.end_date && <p><strong>End Date:</strong> {new Date(event.end_date).toLocaleDateString()}</p>}

            {userRole === "admin" && !reportUrl && (
              <Button variant="success" onClick={() => setShowModal(true)}>
                Generate Report
              </Button>
            )}

            {reportUrl ? (
              <div>
                <h4>Report</h4>
                <a href={reportUrl} target="_blank" rel="noopener noreferrer" className="me-4 btn btn-sm btn-primary">
                  View Report
                </a>
                {wordUrl && (
                  <a href={wordUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-success">
                    Download Report as Word
                  </a>
                )}
              </div>
            ) : (
              <p className="text-muted">Report Not Generated</p>
            )}
          </div>
        )}
      </div>

      {/* Report Generation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Generate Event Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Event Name</Form.Label>
              <Form.Control type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Event Type</Form.Label>
              <Form.Control type="text" name="eventType" value={formData.eventType} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={formData.description} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Upload Event Images</Form.Label>
              <Form.Control type="file" multiple accept="image/*" onChange={handleImageChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Additional Details</Form.Label>
              {formData.dynamicFields.map((field, index) => (
                <div key={index} className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Key"
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
                  <Button variant="danger" size="sm" onClick={() => removeDynamicField(index)}>X</Button>
                </div>
              ))}
              <Button variant="info" size="sm" onClick={addDynamicField}>+ Add Field</Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleGenerateReport} disabled={reportGenerating}>
            {reportGenerating ? "Generating..." : "Create Report"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EventDetails;
