import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Container, Card, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/login", { email, password });
      const { token, role, department } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("department", department);
      navigate(`/dashboard/${role}`);
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 bg-warning">
        <div className="row w-5 shadow-lg rounded bg-white overflow-hidden">
          {/* <div className="col-md-6 d-flex justify-content-center align-items-center bg-warning">
            <motion.img 
              initial={{ scale: 0.8 }} 
              animate={{ scale: 1 }} 
              transition={{ duration: 0.8 }}
              src="/login-illustration.png" 
              alt="Login Illustration" 
              className="img-fluid p-4"
            />
          </div> */}
          <div className="p-5 d-flex flex-column justify-content-center">
            <Card className="border-0 bg-transparent">
              <h2 className="text-center text-warning mb-4">Welcome Back</h2>
              {error && <p className="text-danger text-center">{error}</p>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-warning">Email</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-0">
                      <FaEnvelope className="text-warning" />
                    </span>
                    <Form.Control
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-0 shadow-sm"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text-warning">Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-0">
                      <FaLock className="text-warning" />
                    </span>
                    <Form.Control
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-0 shadow-sm"
                    />
                  </div>
                </Form.Group>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="btn btn-warning w-100 py-2 mt-2 text-white"
                >
                  Sign in
                </motion.button>
              </Form>
              <div className="mt-3 text-center">
                <Link to="/register" className="text-warning text-decoration-none">
                  Don't have an account? Register here
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </motion.div>
  );
};

export default Login;
