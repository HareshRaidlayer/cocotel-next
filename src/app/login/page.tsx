import React from "react";
import { FaUser, FaLock } from "react-icons/fa";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side: Background Image */}
      <div
        className="hidden lg:block lg:w-[80%] h-screen bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://www.cocotel.com/frontend/images/upload/banner/Beach1.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-green-700 opacity-40"></div>
      </div>
      {/* Right Side: Login Form */}
      <div className="w-full lg:w-[30%] bg-white flex flex-col justify-start px-6 py-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-black mb-8">Login</h2>
          <form>
            {/* Username */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username/Email id
              </label>
              <div className="flex items-center border-b-2 border-gray-300 py-2">
                <FaUser className="text-gray-400 mr-2" />
                <input
                  id="username"
                  type="text"
                  placeholder="Type your username"
                  className="w-full bg-transparent text-gray-800 font-bold focus:outline-none"
                />
              </div>
            </div>
            {/* Password */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="flex items-center border-b-2 border-gray-300 py-2">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  id="password"
                  type="password"
                  placeholder="Type your password"
                  className="w-full bg-transparent text-gray-800 font-bold focus:outline-none"
                />
              </div>
            </div>
            {/* Forgot Password + Login Button */}
            <div className="mb-6">
              <div className="flex justify-end mb-4">
                <link
                  href="#"
                  className="text-sm text-black hover:text-green-700 font-semibold"
                >
                  Forgot Your Password?
                </link>
              </div>
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                Login
              </button>
            </div>
            {/* Sign Up */}
            <div className="text-center mt-10">
              <p className="text-black">Don&apos;t have an account?</p>
              <h3 className="text-black font-bold">
                <link href="/register" className="hover:text-green-600 transition">
                  Sign up/Register
                </link>
              </h3>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
