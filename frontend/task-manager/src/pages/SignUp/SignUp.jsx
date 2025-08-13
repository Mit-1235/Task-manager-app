import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosIntance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPass, setErrorPass] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Name is required.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorEmail("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setErrorPass("Password is required.");
      return;
    }

    setError("");
    setErrorEmail("");
    setErrorPass("");

    // Sign Up API Call

    try {
      const response = await axiosIntance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });
      // handle successfull registration response
      if (response.data && response.data.error) {
        setErrorPass(response.data.message);
        return;
      }
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      // handle signup error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorPass(error.response.data.message);
      } else {
        setErrorPass("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSignUp} className="space-y-6">
            <h4 className="text-2xl mb-7">Sign Up</h4>
            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
            {error && <p className="text-red-500 text-[12px] mb-3">{error}</p>}

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            {errorEmail && (
              <p className="text-red-500 text-[12px] mb-3">{errorEmail}</p>
            )}

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorPass && (
              <p className="text-red-500 text-[12px] mb-3">{errorPass}</p>
            )}

            <button type="submit" className="btn-primary w-full py-3 text-lg">
              Create Account
            </button>
            <p className="text-sm text-center mt-4">
              Already have an account? {""}
              <Link
                to="/login"
                className="font-medium text-[#2B85FF] underline hover:no-underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
