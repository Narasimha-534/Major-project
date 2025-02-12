import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Department = ({ dept }) => {
  return (
    <div className="dept_content">
      {["EVENTS", "STUDENT PERFORMANCE", "ACHIEVEMENTS"].map((title) => (
        <Link to={`/${title}/${dept}`} key={title}>
          <div className="card card1 shadow-lg">
            <p>{title}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Department;
