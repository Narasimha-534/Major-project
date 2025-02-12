import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import Navbar from '../Navbar';

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

  if (loading) return <div className="text-center mt-4">Loading details...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <Card className="shadow p-4">
          <Card.Body>
            <h2 className="text-center">{achievement.title}</h2>
            <p><strong>Name:</strong> {achievement.name}</p>
            <p><strong>Category:</strong> {achievement.category}</p>
            <p><strong>Department:</strong> {achievement.department}</p>
            <p><strong>Date:</strong> {new Date(achievement.date).toLocaleDateString()}</p>
            <p><strong>Description:</strong> {achievement.description}</p>
            {achievement.document_url && (
              <p><strong>Document:</strong> <a href={achievement.document_url} target="_blank" rel="noopener noreferrer">View Document</a></p>
            )}
            <Button variant="warning" onClick={() => window.history.back()}>Go Back</Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AchievementDetails;
