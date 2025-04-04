import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Badge } from 'react-bootstrap';
import { FaTrophy, FaCalendarAlt, FaFileAlt, FaArrowLeft } from 'react-icons/fa';
import Navbar from '../Navbar';

// Simplified styling
const purpleTheme = {
  gradient: "linear-gradient(45deg, #4B0082, #800080)",
  light: "rgba(75,0,130,0.1)",
  text: "#4B0082",
  border: "1px solid rgba(75,0,130,0.2)"
};

const AchievementDetails = () => {
  const { id } = useParams();
  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/achievements/${id}`);
        if (!response.ok) throw new Error("Failed to fetch achievement details");
        setAchievement(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievement();
  }, [id]);

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
              <FaTrophy className="me-2" />
              Achievement Details
            </h2>
          </div>
          
          {achievement && (
            <div className="card-body">
              <h3 style={{ color: purpleTheme.text }}>{achievement.title}</h3>
              
              <div className="d-flex gap-2 mb-3">
                <Badge pill bg="light" text="dark">{achievement.category}</Badge>
                {achievement.type && (
                  <Badge pill bg="light" text="dark">{achievement.type}</Badge>
                )}
                <Badge pill style={{ background: purpleTheme.light, color: purpleTheme.text }}>
                  {achievement.department}
                </Badge>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6 mb-2">
                  <strong>Name:</strong> {achievement.name}
                </div>
                <div className="col-md-6 mb-2">
                  <strong><FaCalendarAlt className="me-1" /> Date:</strong> {new Date(achievement.date).toLocaleDateString()}
                </div>
              </div>
              
              <p><strong>Description:</strong> {achievement.description}</p>
              
              {achievement.document_url && (
                <div className="mt-3">
                  <a 
                    href={achievement.document_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-sm" 
                    style={{ background: purpleTheme.gradient, color: "white" }}
                  >
                    <FaFileAlt className="me-2" />
                    View Document
                  </a>
                </div>
              )}
              
              <hr />
              
              <Button 
                onClick={() => window.history.back()} 
                style={{ background: "white", color: purpleTheme.text, border: purpleTheme.border }}
                className="mt-2"
              >
                <FaArrowLeft className="me-2" />
                Go Back
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AchievementDetails;
