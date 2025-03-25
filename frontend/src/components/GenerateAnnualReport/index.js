import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Table, Spinner, Alert, Form } from "react-bootstrap";
import Navbar from "../Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

const GenerateAnnualReport = () => {
  const navigate = useNavigate();

  const [selectedYear, setSelectedYear] = useState(sessionStorage.getItem("selectedYear") || "");
  const [availableYears, setAvailableYears] = useState([]);
  const [events, setEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState(
    JSON.parse(sessionStorage.getItem("selectedItems")) || { events: [], achievements: [] }
  );
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(sessionStorage.getItem("selectedDepartment") || "");
  const [achievementCategories, setAchievementCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(sessionStorage.getItem("selectedCategory") || "");
  const [placementInfo, setPlacementInfo] = useState({ totalRegistered: "", companiesArrived: "", studentsPlaced: "" });
  const [reportUrl, setReportUrl] = useState(null);
  const [wordUrl, setWordUrl] = useState(null);

  const [reportAlreadyGenerated,setReportAlreadyGenerated] = useState(false)


  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1999 }, (_, i) => `${currentYear - i - 1}-${currentYear - i}`);
    setAvailableYears(years);
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
  
    const checkReport = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/annual-report?academicYear=${selectedYear}`);
        if (!response.ok) throw new Error("Failed to check report status");
  
        const data = await response.json();
        console.log(data)
        if(data.length === 1) {
          setReportUrl(data[0].report_url);
          setWordUrl(data[0].report_docx_url);
        }
        setReportAlreadyGenerated(data.length === 1);
      } catch (err) {
        console.error("Error checking report:", err);
      }
    };
  
    checkReport();
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedYear || reportAlreadyGenerated) return;

    setLoading(true);
    setError(null);
    fetch(`http://localhost:5000/api/data/by-academic-year?academicYear=${selectedYear}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setEvents(data.events || []);
        setAchievements(data.achievements || []);
        setFilteredEvents(data.events || []);
        setFilteredAchievements(data.achievements || []);

        const uniqueDepartments = [...new Set(data.events.map((event) => event.department))];
        setDepartments(uniqueDepartments);

        const uniqueCategories = [...new Set(data.achievements.map((ach) => ach.category))];
        setAchievementCategories(uniqueCategories);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedYear, reportAlreadyGenerated]);

  useEffect(() => {
    setFilteredEvents(selectedDepartment ? events.filter((event) => event.department === selectedDepartment) : events);
  }, [selectedDepartment, events]);

  useEffect(() => {
    setFilteredAchievements(selectedCategory ? achievements.filter((ach) => ach.category === selectedCategory) : achievements);
  }, [selectedCategory, achievements]);

  // Persist selections in sessionStorage
  useEffect(() => {
    sessionStorage.setItem("selectedYear", selectedYear);
    sessionStorage.setItem("selectedDepartment", selectedDepartment);
    sessionStorage.setItem("selectedCategory", selectedCategory);
    sessionStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  }, [selectedYear, selectedDepartment, selectedCategory, selectedItems]);

  const handleSelectItem = (type, id) => {
    setSelectedItems((prev) => {
      const updatedItems = prev[type].includes(id)
        ? prev[type].filter((itemId) => itemId !== id)
        : [...prev[type], id];
      return { ...prev, [type]: updatedItems };
    });
  };

  const handleEventRowClick = (id, dept) => {
    navigate(`/EVENTS/${dept}/${id}`);
  };

  const handleAchievementRowClick = (id, dept) => {
    navigate(`/ACHIEVEMENTS/${dept}/${id}`);
  };

  const handleGenerateReport = async () => {
    if (!selectedYear) {
        alert("Please select an academic year.");
        return;
    }

    const requestData = {
        academicYear: selectedYear,
        selectedEvents: events.filter((event) => selectedItems.events.includes(event.id)),
        selectedAchievements: achievements.filter((ach) => selectedItems.achievements.includes(ach.id)),
        placementInfo,
    };

    console.log("Sending request to backend with data:", requestData);

    try {
        const response = await fetch("http://localhost:5000/api/generate-annual-report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
        });

        console.log("Raw response from backend:", response); // Log raw response

        if (!response.ok) {
            console.error("Failed to generate report. Status:", response.status);
            throw new Error("Failed to generate report");
        }

        const data = await response.json();
        // console.log("Full API Response:", data); // Log received data

        if (data.success) { 
            if (data.report_url && data.word_url) { 
                // setReportUrl(data.report_url);
                // setWordUrl(data.word_url);
                window.location.reload(); 
            } else {
                console.error("Report URLs are missing in API response:", data);
                alert("Failed to fetch report URLs. Please try again.");
            }
        } else {
            console.error("API response structure is incorrect:", data);
            alert("Failed to generate report. Please try again.");
        }
    } catch (error) {
        console.error("Error generating report:", error);
        alert("Error generating report. Please try again.");
    }
};



  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);

    sessionStorage.removeItem("selectedItems");
    sessionStorage.removeItem("selectedDepartment");
    sessionStorage.removeItem("selectedCategory");

    setSelectedItems({ events: [], achievements: [] });
    setSelectedDepartment("");
    setSelectedCategory("");
  };

  const handlePlacementInfoChange = (e) => {
    setPlacementInfo({ ...placementInfo, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Generate Annual Report</h2>
        <p>Select data and generate the annual report.</p>

        <div className="mb-3">
          <select className="form-select" value={selectedYear} onChange={handleYearChange}>
            <option value="">Select Academic Year</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {selectedYear && !reportAlreadyGenerated && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Events</h4>
              <Form.Select style={{ width: "250px" }} value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                <option value="">Filter by Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </Form.Select>
            </div>

            {loading && <Spinner animation="border" className="d-block mx-auto" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && filteredEvents.length === 0 && <p className="text-center">No events found for the selected year.</p>}
            
            {!loading && filteredEvents.length > 0 && (
              <Table hover responsive className="shadow-sm rounded overflow-hidden">
                <thead className="bg-warning text-dark">
                  <tr>
                    <th>#</th><th>Select</th><th>Event Name</th><th>Type</th><th>Department</th><th>Scheduled Date</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event, index) => (
                    <tr key={event.id} onClick={() => handleEventRowClick(event.id, event.department, "EVENTS")}>
                      <td>{index + 1}</td>
                      <td onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedItems.events.includes(event.id)} onChange={() => handleSelectItem("events", event.id)} /></td>
                      <td>{event.event_name}</td>
                      <td>{event.event_type}</td>
                      <td>{event.department}</td>
                      <td>{new Date(event.scheduled_date).toLocaleDateString()}</td>
                      <td><Badge bg={event.status === "Completed" ? "success" : event.status === "Ongoing" ? "warning" : "danger"}>{event.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Achievements</h4>
              <Form.Select style={{ width: "250px" }} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Filter by Category</option>
                {achievementCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </div>

            {filteredAchievements.length === 0 && <p className="text-center">No achievements found for the selected year.</p>}

            {filteredAchievements.length > 0 && (
              <Table hover responsive>
                <thead>
                  <tr><th>#</th><th>Select</th><th>Title</th><th>Name</th><th>Category</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {filteredAchievements.map((ach, index) => (
                    <tr key={ach.id} onClick={() => handleAchievementRowClick(ach.id, ach.department, "ACHIEVEMENTS")}>
                      <td>{index + 1}</td>
                      <td onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedItems.achievements.includes(ach.id)} onChange={() => handleSelectItem("achievements", ach.id)} /></td>
                      <td>{ach.title}</td>
                      <td>{ach.name}</td>
                      <td>{ach.category}</td>
                      <td>{new Date(ach.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            <div className="mb-4">
            <h4>Placement Information</h4>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Total Registered Students</Form.Label>
                <Form.Control type="number" name="totalRegistered" value={placementInfo.totalRegistered} onChange={handlePlacementInfoChange} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Number of Companies Arrived</Form.Label>
                <Form.Control type="number" name="companiesArrived" value={placementInfo.companiesArrived} onChange={handlePlacementInfoChange} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Total Students Placed</Form.Label>
                <Form.Control type="number" name="studentsPlaced" value={placementInfo.studentsPlaced} onChange={handlePlacementInfoChange} />
              </Form.Group>
            </Form>
        </div>

            <button className="mt-3" style={{ background: "linear-gradient(45deg, #4B0082, #800080)", border: "none", color: "white", padding: "10px 20px", borderRadius: "5px", textDecoration: "none", marginTop: "10px" }} onClick={handleGenerateReport}>Generate Report</button>
          </>
        )}

        {reportAlreadyGenerated && (
          <div>
            <a href={reportUrl} target="_blank" rel="noopener noreferrer">
              <button className="m-2" style={{ background: "linear-gradient(45deg, #4B0082, #800080)", border: "none", color: "white", padding: "10px 20px", borderRadius: "5px", textDecoration: "none", marginTop: "10px" }}>Open PDF Report</button>
            </a>
            <a href={wordUrl} target="_blank" rel="noopener noreferrer">
              <button style={{ background: "linear-gradient(45deg, #4B0082, #800080)", border: "none", color: "white", padding: "10px 20px", borderRadius: "5px", textDecoration: "none", marginTop: "10px" }}>Open Word Report</button>
            </a>
          </div>
        )}

        {/* <p>Report generated successfully. Click below to open:</p> */}

        {/* {reportUrl && (
          <div>
            <a href={reportUrl} target="_blank" rel="noopener noreferrer">
              <button>Open PDF Report</button>
            </a>
            <a href={wordUrl} target="_blank" rel="noopener noreferrer">
              <button>Open Word Report</button>
            </a>
          </div>
        )} */}

      </div>
    </>
  );
};

export default GenerateAnnualReport;
