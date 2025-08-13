import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, resolvePath, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosIntance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setErrorPassword("Password is required.");
      return;
    }

    setError("");
    setErrorPassword("");

    // Login API Call
    try {
      const response = await axiosIntance.post("/login", {
        email: email,
        password: password,
      });
      // handle successfull login response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      // handle login error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full sm:w-[400px] md:w-[450px] bg-white shadow-md rounded-lg px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7 text-center font-semibold">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            {error && <p className="text-red-500 text-[12px] mb-3">{error}</p>}

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {errorPassword && (
              <p className="text-red-500 text-[12px] mb-3">{errorPassword}</p>
            )}

            <button type="submit" className="btn-primary w-full mt-4">
              Login
            </button>
            <p className="text-sm text-center mt-4">
              Not registered yet? {""}
              <Link
                to="/signup"
                className="font-medium text-[#2B85FF] underline hover:no-underline"
              >
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
