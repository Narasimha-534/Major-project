import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AnnualReports = ({ userRole }) => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {    
      const fetchReports = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/annual-report`);
          if (!response.ok) throw new Error("Failed to fetch reports");
    
          const data = await response.json();
          setReports(data);
        } catch (err) {
          console.error("Error fetching reports:", err);
        }
      };
    
      fetchReports();
  }, []);

  const handleGenerateReport = () => {
    navigate("/generate-annual-report"); 
  };

  return (
    <div className="container mt-4">
      {/* Admin can generate new reports */}
      {userRole === "admin" && (
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-warning" style={{ background: "linear-gradient(45deg, #4B0082, #800080)", border: "none", color: "white" }} onClick={handleGenerateReport}>
            Generate Report
          </button>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-warning" style={{background: "rgba(75,0,130,0.1)"}}>
            <tr>
              <th>Academic Year</th>
              <th>Open PDF</th>
              <th>Download Word</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <tr key={index}>
                  <td>{report.academic_year}</td>
                  <td>
                    <a href={report.report_url} style={{ background: "linear-gradient(45deg, #4B0082, #800080)", border: "none", color: "white", padding: "10px 20px", borderRadius: "5px", textDecoration: "none", marginTop: "10px" }} target="_blank" rel="noopener noreferrer">
                      Open PDF
                    </a>
                  </td>
                  <td>
                    <a href={report.report_docx_url} className="btn btn-link" target="_blank" rel="noopener noreferrer">
                      Download DOCX
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">No reports available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnnualReports;
