import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // EMAIL VALIDATION
    if (!emailRegex.test(form.email)) {
      alert("❌ Please enter a valid email address");
      return;
    }

    // PASSWORD VALIDATION
    if (form.password.length < 6) {
      alert("❌ Password must be at least 6 characters");
      return;
    }

    try {
      await API.post("/auth/register", form);

      alert("✅ Registered successfully");

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >

        <h2 className="text-xl mb-4 font-bold">Register</h2>

        {/* NAME */}
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        {/* PASSWORD */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Register
        </button>

        {/* LOGIN LINK */}
        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600">
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}