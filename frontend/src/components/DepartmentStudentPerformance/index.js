import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Navbar from '../Navbar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const DepartmentStudentPerformance = () => {
  const [activeSemester, setActiveSemester] = useState('Sem1');
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedFile, setSelectedFile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role,setRole] = useState('');
  const semesters = ['Sem1', 'Sem2', 'Sem3', 'Sem4', 'Sem5', 'Sem6', 'Sem7', 'Sem8'];

  useEffect(() => {
    setRole(localStorage.getItem('role'));
  },[])

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/analytics?year=${selectedYear}&semester=${activeSemester}`);
      const data = await response.json();
      console.log(data);
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
    setLoading(false);
  };

  const formattedTopPerformers = (analytics?.topPerformers || []).map((item) => ({
    student_name: item.student_name,
    avg_marks: Number(item.avg_marks), 
  }));

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    
    const formData = new FormData();
    formData.append("year", selectedYear);
    formData.append("semester", activeSemester);
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/api/upload-result", {
        method: "POST",
        body: formData
      });
      
      const result = await response.json();
      alert(result.message);
      setShowModal(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed.");
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className='bg-white min-vh-100'>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-3 mb-3">
            <div className="list-group shadow-sm">
              {semesters.map((each) => (
                <motion.button
                  key={each}
                  className={`list-group-item list-group-item-action fw-bold ${activeSemester === each ? "active bg-warning text-dark" : ""}`}
                  onClick={() => setActiveSemester(each)}
                  whileHover={{ scale: 1.05 }}
                >
                  {each}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div className="card shadow-lg p-5 col-md-9" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="d-flex flex-row justify-content-between bg-white p-4 border-0">
              <h1>Student Performance</h1> 
              <div>
                <select className='me-5' value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                  <option>2021</option>
                  <option>2022</option>
                  <option>2023</option>
                  <option>2024</option>
                  <option>2025</option>
                </select>
                {role === 'admin' && <button className='btn btn-warning' onClick={() => setShowModal(true)}>Upload</button>}
              </div>
            </div>
            
            <div className="mt-4">
              <button className='btn btn-warning' onClick={fetchAnalyticsData} disabled={loading}>
                {loading ? "Processing..." : "Get Analytics"}
              </button>  
              {analytics && (
              <div className="mt-4">
                <h3 className="mb-3">Performance Analytics</h3>
                <div className="row">
                  <div className="col-md-6">
                    <h5>Subject-wise Average Marks</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.averageMarks}>
                        <XAxis dataKey="subject" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="average_marks" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="col-md-6">
                    <h5>Performance Trend Over Semesters</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics.performanceTrend}>
                        <XAxis dataKey="semester" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="avg_marks" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h5>Top Performers</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    {(analytics?.topPerformers || []).length > 0 ? (
                      <PieChart>
                        <Pie 
                          data={formattedTopPerformers} 
                          dataKey="avg_marks" 
                          nameKey="student_name" 
                          outerRadius={100} 
                          fill="#8884d8" 
                          label
                        >
                          {(analytics?.topPerformers || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    ) : (
                      <p>No data available</p>
                    )}

                  </ResponsiveContainer>
                </div>
              </div>
            )}  
            </div>

          </motion.div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Result Sheet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type='file' className='form-control' onChange={(e) => setSelectedFile(e.target.files[0])} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="warning" onClick={handleFileUpload}>Upload</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DepartmentStudentPerformance;
