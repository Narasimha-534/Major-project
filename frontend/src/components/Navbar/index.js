import React, {useEffect,useState} from 'react';
import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './index.css'; 

const Navbar = () => {
  const [userRole,setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
      const role = localStorage.getItem("role");
      setRole(role);
    }, [navigate]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        {/* Logo */}
        <Link to={`/dashboard/${userRole}`} className="navbar-brand fw-bold fs-4 text-warning">
          Generator
        </Link>

        {/* Toggle Button for Mobile */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item mx-2">
              <Link to={`/dashboard/${userRole}`} className="nav-link text-white">
                Home
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link to="/reports" className="nav-link text-white">
                Reports
              </Link>
            </li>
            <li className="nav-item mx-2">
              <button className="btn btn-outline-warning d-flex align-items-center">
                <User className="me-2" size={18} />
                <span className="d-none d-md-inline">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
