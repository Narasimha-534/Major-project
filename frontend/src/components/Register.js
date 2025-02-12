import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaGraduationCap, FaChalkboardTeacher, FaUserCog } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    department: "computer_science",
    studentId: "",
    yearOfStudy: "",
    facultyId: "",
    position: "",
    adminId: "",
    adminLevel: "department",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/register", formData);
      console.log("Registration response:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="bg-warning">
      <div className="container d-flex justify-content-center align-items-center vh-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card shadow-lg p-4 w-50 border-0 rounded-4"
      >
        <h2 className="text-center mb-4 text-warning fw-bold">Create an Account</h2>
        {error && <p className="text-danger text-center fw-bold">{error}</p>}
        <form onSubmit={handleSubmit}>
          <InputField icon={<FaUser className=" text-white" />} type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
          <InputField icon={<FaEnvelope className="text-white" />} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <InputField icon={<FaLock className="text-white" />} type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
          
          <SelectField name="role" value={formData.role} onChange={handleChange} options={[{ value: "student", label: "Student" }, { value: "faculty", label: "Faculty" }, { value: "admin", label: "Admin" }]} />
          <SelectField name="department" value={formData.department} onChange={handleChange} options={[{ value: "computer_science", label: "Computer Science" }, { value: "electrical_engineering", label: "Electrical Engineering" }, { value: "mechanical_engineering", label: "Mechanical Engineering" }]} />
          
          {formData.role === "student" && (
            <>
              <InputField icon={<FaGraduationCap className="text-white" />} type="text" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="Student ID" required />
              <InputField type="number" name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} placeholder="Year of Study" required min="1" max="6" />
            </>
          )}

          {formData.role === "faculty" && (
            <>
              <InputField icon={<FaChalkboardTeacher className="text-warning" />} type="text" name="facultyId" value={formData.facultyId} onChange={handleChange} placeholder="Faculty ID" required />
              <InputField type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position" required />
            </>
          )}

          {formData.role === "admin" && (
            <>
              <InputField icon={<FaUserCog />} type="text" name="adminId" value={formData.adminId} onChange={handleChange} placeholder="Admin ID" required />
              <SelectField name="adminLevel" value={formData.adminLevel} onChange={handleChange} options={[{ value: "department", label: "Department Level" }, { value: "college", label: "College Level" }]} />
            </>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="btn btn-warning w-100 mt-3 fw-bold py-2 rounded-3"
          >
            Register
          </motion.button>
        </form>
        <div className="text-center mt-3">
          <Link to="/login" className="text-decoration-none text-warning fw-bold">Already have an account? Sign in</Link>
        </div>
      </motion.div>
    </div>

    </div>
  );
};

const InputField = ({ icon, ...props }) => (
  <div className="mb-3 input-group">
    <span className="input-group-text bg-warning text-white">{icon}</span>
    <input {...props} className="form-control border-0 shadow-sm" />
  </div>
);

const SelectField = ({ name, value, onChange, options }) => (
  <div className="mb-3">
    <select name={name} value={value} onChange={onChange} className="form-select border-0 shadow-sm">
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

export default Register;
