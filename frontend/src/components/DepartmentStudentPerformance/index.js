import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Legend 
} from 'recharts';
import Navbar from '../Navbar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FaChartBar, FaUpload, FaBook } from 'react-icons/fa';

// Theme configuration to match AllEvents
const purpleTheme = {
  gradient: "linear-gradient(45deg, #4B0082, #800080)",
  light: "rgba(75,0,130,0.1)",
  text: "#4B0082",
  border: "1px solid rgba(75,0,130,0.2)"
};

const DepartmentStudentPerformance = () => {
  const { dept } = useParams();
  const [activeSemester, setActiveSemester] = useState('Sem1');
  const [showModal, setShowModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('2021-2025');
  const [selectedFile, setSelectedFile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  
  const semesters = ['Sem1', 'Sem2', 'Sem3', 'Sem4', 'Sem5', 'Sem6', 'Sem7', 'Sem8'];
  const batches = ['2021-2025', '2022-2026', '2023-2027', '2024-2028'];

  useEffect(() => {
    setRole(localStorage.getItem('role'));
  }, []);

  useEffect(() => {
    setAnalytics(null); 
    checkDataAvailability();
  }, [activeSemester, selectedBatch]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const semesterNumber = activeSemester.replace("Sem", "");
      const response = await fetch(`http://localhost:5000/api/analytics?batchNumber=${selectedBatch}&semester=${semesterNumber}&department=${dept}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
    setLoading(false);
  };

  const checkDataAvailability = async () => {
    setLoading(true);
    try {
      const semesterNumber = activeSemester.replace("Sem", "");
      const response = await fetch(`http://localhost:5000/api/check-data?batchNumber=${selectedBatch}&semester=${semesterNumber}&department=${dept}`);
      const data = await response.json();
      setIsDataAvailable(data.exists); 
    } catch (error) {
      console.error("Error checking data availability:", error);
    }
    setLoading(false);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    
    const formData = new FormData();
    const semesterNumber = activeSemester.replace("Sem", "");
    formData.append("batchNumber", selectedBatch);
    formData.append("semester", semesterNumber);
    formData.append("department", dept);
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/api/upload-result", {
        method: "POST",
        body: formData
      });
      
      const result = await response.json();
      setShowModal(false);
      checkDataAvailability();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed.");
    }
  };


  return (
    <div className='min-vh-100' style={{ backgroundColor: purpleTheme.light }}>
      <Navbar />
      <div className="container mt-4 pb-5">
        <motion.div 
          className="row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="col-md-3 mb-3">
            <div className="list-group shadow-sm">
              {semesters.map((each) => (
                <motion.button
                  key={each}
                  className={`list-group-item list-group-item-action fw-bold ${activeSemester === each ? "active" : ""}`}
                  onClick={() => setActiveSemester(each)}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    background: activeSemester === each ? purpleTheme.gradient : "white",
                    color: activeSemester === each ? "white" : purpleTheme.text,
                    border: purpleTheme.border
                  }}
                >
                  <FaBook className="me-2" />
                  {each}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div 
            className="card shadow-lg p-4 col-md-9" 
            style={{ borderRadius: "10px", border: purpleTheme.border }}
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.5 }}
          >
            <div className="d-flex flex-row justify-content-between p-2 mb-3">
              <h1 className="mb-0" style={{ color: purpleTheme.text }}>
                <FaChartBar className="me-2" />
                {dept} Performance
              </h1> 
              <div className="d-flex align-items-center">
                <select 
                  className='form-select me-3' 
                  value={selectedBatch} 
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  style={{ borderColor: purpleTheme.text, color: purpleTheme.text }}
                >
                  {batches.map(batch => <option key={batch}>{batch}</option>)}
                </select>
                {role === 'admin' && 
                  <Button 
                    style={{ background: purpleTheme.gradient, border: 'none' }}
                    onClick={() => setShowModal(true)}
                  >
                    <FaUpload className="me-2" />
                    Upload
                  </Button>
                }
              </div>
            </div>
            
            <div className="mt-3">
              <div className="mt-3">
                {isDataAvailable ? (
                  <Button 
                    style={{ background: purpleTheme.gradient, border: 'none' }}
                    onClick={fetchAnalyticsData} 
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Get Analytics"}
                  </Button>
                ) : (
                  <div className="mt-4 text-center p-5" style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '10px' }}>
                    <FaChartBar className="display-1 mb-3" style={{ color: purpleTheme.text }} />
                    <h4 className="text-muted">No data uploaded for this semester.</h4>
                  </div>
                )}
              </div>

              {loading && (
                <div className="d-flex justify-content-center align-items-center p-5">
                  <div className="spinner-border" style={{ color: purpleTheme.text }}></div>
                  <span className="ms-3" style={{ color: purpleTheme.text }}>Loading analytics...</span>
                </div>
              )}
              
              {analytics && (
                <motion.div 
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="mb-3" style={{ color: purpleTheme.text }}>Performance Analytics</h3>
                  <div className="row">

                    {/* Subject-wise Average Marks */}
                    {analytics?.averageMarks && (
                      <div className="col-md-6 mb-4">
                        <div className="card shadow-sm p-3" style={{ border: purpleTheme.border, borderRadius: "10px" }}>
                          <h5 style={{ color: purpleTheme.text }}>Subject-wise Average Marks</h5>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.averageMarks}>
                              <XAxis dataKey="subject" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="average_marks" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Fail Counts Per Subject */}
                    {analytics?.failCounts && (
                      <div className="col-md-6 mb-4">
                        <div className="card shadow-sm p-3" style={{ border: purpleTheme.border, borderRadius: "10px" }}>
                          <h5 style={{ color: purpleTheme.text }}>Fail Counts Per Subject</h5>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.failCounts}>
                              <XAxis dataKey="subject" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="fail_count" fill="#ff4d4d" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Pass Percentage Per Subject */}
                    {analytics?.passPercentage && analytics.passPercentage.length > 0 && (
                      <div className="col-md-6 mt-2">
                        <div className="card shadow-sm p-3" style={{ border: purpleTheme.border, borderRadius: "10px" }}>
                          <h5 style={{ color: purpleTheme.text }}>Pass Percentage Per Subject</h5>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={analytics.passPercentage
                                .filter(pass => !isNaN(parseFloat(pass.pass_percentage))) // Remove NaN values
                                .map(pass => ({
                                  subject: pass.subject,
                                  pass_percentage: parseFloat(pass.pass_percentage) || 0, // Ensure number type
                                }))
                              }
                              layout="vertical"
                            >
                              <XAxis type="number" domain={[0, 100]} />
                              <YAxis dataKey="subject" type="category" />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="pass_percentage" fill="#4B0082" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                  </div>
                </motion.div>
              )}

            {/* Detailed Table with Pass Percentage */}
            {analytics && (
              <motion.div 
                className="mt-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 style={{ color: purpleTheme.text }}>Detailed Performance Data</h3>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover mt-3 shadow-sm" style={{ borderRadius: "10px", overflow: "hidden" }}>
                    <thead style={{ background: purpleTheme.gradient, color: "white" }}>
                      <tr>
                        <th>Subject</th>
                        <th>Average Marks</th>
                        <th>Fail Count</th>
                        <th>Pass Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.averageMarks.map((avgMark, index) => {
                        const failData = analytics.failCounts.find(fail => fail.subject === avgMark.subject);
                        const passData = analytics.passPercentage.find(pass => pass.subject === avgMark.subject);
                        return (
                          <tr key={index}>
                            <td>{avgMark.subject}</td>
                            <td>{parseFloat(avgMark.average_marks).toFixed(2)}</td>
                            <td>{failData ? failData.fail_count : "N/A"}</td>
                            <td>{passData ? `${parseFloat(passData.pass_percentage).toFixed(2)}%` : "N/A"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}


            </div>

          </motion.div>
        </motion.div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton style={{ background: purpleTheme.light }}>
          <Modal.Title style={{ color: purpleTheme.text }}>Upload Result Sheet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label" style={{ color: purpleTheme.text }}>Select Excel File</label>
            <input type='file' className='form-control' onChange={(e) => setSelectedFile(e.target.files[0])} />
          </div>
          <div className="small text-muted">
            Upload Excel file with student results. File should contain student ID, marks, and subjects.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button style={{ background: purpleTheme.gradient, border: 'none' }} onClick={handleFileUpload}>
            <FaUpload className="me-2" />
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DepartmentStudentPerformance;
