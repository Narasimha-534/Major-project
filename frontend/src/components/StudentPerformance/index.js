import React, { useEffect, useState } from "react";
import { Form, Container, Row, Col, Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { FaChartBar, FaGraduationCap, FaUniversity } from "react-icons/fa";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Theme configuration
const purpleTheme = {
  gradient: "linear-gradient(45deg, #4B0082, #800080)",
  light: "rgba(75,0,130,0.1)",
  text: "#4B0082",
  border: "1px solid rgba(75,0,130,0.2)"
};

const StudentPerformance = () => {
  const [batch, setBatch] = useState("");
  const [chartData, setChartData] = useState(null);
  const [overallData, setOverallData] = useState(null);
  const [loading, setLoading] = useState(false);
  const batches = ["2021-2025", "2022-2026", "2023-2027"]; // Example batch list

  useEffect(() => {
    if (batch) {
      fetchBatchPerformance(batch);
    }
  }, [batch]);

  const fetchBatchPerformance = async (selectedBatch) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/batch-performance?batch=${selectedBatch}`);
      const data = await response.json();

      if (response.ok) {
        processChartData(data.batchPerformance);
        processOverallData(data.overallDepartmentPerformance);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error fetching batch performance:", error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data) => {
    const semesters = [...new Set(data.map((item) => item.semester))];
    const departments = [...new Set(data.map((item) => item.department))];

    semesters.sort((a, b) => a - b); // Sort semesters numerically

    const departmentColors = {
      CSE: "rgba(75, 0, 130, 0.7)",
      ECE: "rgba(138, 43, 226, 0.7)",
      EEE: "rgba(123, 104, 238, 0.7)",
      MECH: "rgba(153, 50, 204, 0.7)",
      CIVIL: "rgba(186, 85, 211, 0.7)",
      IT: "rgba(128, 0, 128, 0.7)"
    };

    const dataset = departments.map((dept) => ({
      label: dept,
      data: semesters.map((sem) => {
        const record = data.find((item) => item.semester === sem && item.department === dept);
        return record ? parseFloat(record.avg_pass_percentage) : 0;
      }),
      backgroundColor: departmentColors[dept] || `rgba(${Math.floor(Math.random() * 255)}, 99, 132, 0.6)`,
      borderColor: "#4B0082",
      borderWidth: 1
    }));

    setChartData({
      labels: semesters.map((s) => `Sem ${s}`),
      datasets: dataset
    });
  };

  const processOverallData = (data) => {
    const departments = data.map(item => item.department);
    const percentages = data.map(item => parseFloat(item.average_pass_percentage));

    const departmentColors = {
      CSE: "rgba(75, 0, 130, 0.7)",
      ECE: "rgba(138, 43, 226, 0.7)",
      EEE: "rgba(123, 104, 238, 0.7)",
      MECH: "rgba(153, 50, 204, 0.7)",
      CIVIL: "rgba(186, 85, 211, 0.7)",
      IT: "rgba(128, 0, 128, 0.7)"
    };

    const backgroundColors = departments.map(dep => departmentColors[dep] || `rgba(${Math.floor(Math.random() * 255)}, 99, 132, 0.6)`);

    setOverallData({
      labels: departments,
      datasets: [
        {
          label: "Avg Pass % (All Batches)",
          data: percentages,
          backgroundColor: backgroundColors,
          borderColor: "#4B0082",
          borderWidth: 1
        }
      ]
    });
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: purpleTheme.light }}>
      <Container className="py-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-lg mb-4" style={{ borderRadius: "10px", border: purpleTheme.border }}>
            <Card.Body>
              <Row className="align-items-center mb-3">
                <Col>
                  <h2 style={{ color: purpleTheme.text }}>
                    <FaGraduationCap className="me-2" />
                    Student Performance Analysis
                  </h2>
                </Col>
                <Col xs="auto">
                  <Form.Select 
                    onChange={(e) => setBatch(e.target.value)} 
                    value={batch}
                    style={{ borderColor: purpleTheme.text, color: purpleTheme.text, minWidth: "150px" }}
                  >
                    <option value="">Select Batch</option>
                    {batches.map((b, i) => (
                      <option key={i} value={b}>{b}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>

              {loading && (
                <div className="d-flex justify-content-center align-items-center p-5">
                  <div className="spinner-border" style={{ color: purpleTheme.text }}></div>
                  <span className="ms-3" style={{ color: purpleTheme.text }}>Loading data...</span>
                </div>
              )}

              {!batch && !loading && (
                <div className="text-center p-5" style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '10px' }}>
                  <FaUniversity className="display-1 mb-3" style={{ color: purpleTheme.text }} />
                  <h4 className="text-muted">Select a batch to view performance analysis</h4>
                </div>
              )}

              {chartData && !loading && (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <div className="card shadow-sm p-3 mt-3" style={{ border: purpleTheme.border, borderRadius: "10px" }}>
                      <div style={{ position: "relative", height: "280px", width: "100%", marginBottom: "20px" }}>
                        <Bar
                          data={chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                              title: {
                                display: true,
                                text: `Semester-wise Pass Percentage for ${batch}`,
                                font: { size: 14, weight: 'bold' },
                                color: purpleTheme.text,
                                padding: { top: 5, bottom: 10 }
                              },
                              legend: {
                                position: "top",
                                align: "center",
                                labels: {
                                  usePointStyle: true,
                                  boxWidth: 8,
                                  font: { size: 11 },
                                  padding: 15
                                }
                              },
                              tooltip: {
                                backgroundColor: 'rgba(75, 0, 130, 0.8)',
                                titleFont: { size: 13 },
                                bodyFont: { size: 12 },
                                padding: 8,
                                cornerRadius: 6
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                max: 100,
                                title: {
                                  display: true,
                                  text: "Pass %",
                                  font: { weight: 'bold', size: 12 }
                                },
                                grid: { color: 'rgba(75, 0, 130, 0.1)' },
                                ticks: { font: { size: 10 } }
                              },
                              x: {
                                grid: { color: 'rgba(75, 0, 130, 0.1)' },
                                ticks: { font: { size: 10 } }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* New Chart - Overall Department Performance */}
                  {overallData && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
                      <div className="card shadow-sm p-3 mt-4" style={{ border: purpleTheme.border, borderRadius: "10px" }}>
                        <div style={{ position: "relative", height: "260px", width: "100%", marginBottom: "20px" }}>
                          <Bar
                            data={overallData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: true,
                              plugins: {
                                title: {
                                  display: true,
                                  text: "Overall Department-wise Average Pass Percentage",
                                  font: { size: 14, weight: 'bold' },
                                  color: purpleTheme.text,
                                  padding: { top: 5, bottom: 10 }
                                },
                                legend: { display: false },
                                tooltip: {
                                  backgroundColor: 'rgba(75, 0, 130, 0.8)',
                                  titleFont: { size: 13 },
                                  bodyFont: { size: 12 },
                                  padding: 8,
                                  cornerRadius: 6
                                }
                              },
                              scales: {
                                y: {
                                  beginAtZero: true,
                                  max: 100,
                                  title: {
                                    display: true,
                                    text: "Pass %",
                                    font: { weight: 'bold', size: 12 }
                                  },
                                  grid: { color: 'rgba(75, 0, 130, 0.1)' }
                                },
                                x: {
                                  grid: { color: 'rgba(75, 0, 130, 0.1)' }
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default StudentPerformance;
