import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useSignUp } from "../hooks/auth";
import { Link } from "react-router-dom";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useSignUp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, email, password });
  };

  return (
    <main className="flex items-center justify-center min-h-screen mb-130 lg:mb-80 relative z-30 bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-8 w-full max-w-sm shadow-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-2xl focus:outline-none"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-2xl focus:outline-none"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-6 relative">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-2xl focus:outline-none"
            placeholder="Enter your password"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-11 cursor-pointer text-gray-600"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-black text-white py-2 rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isPending ? "Signing In..." : "Sign In"}
        </button>
        <div className="flex items-center justify-center gap-3 mt-2 text-xs">
          <span className="">Have account?</span>{" "}
          <Link className="text-blue-700" to={"/sign-in"}>
            Login
          </Link>
        </div>
      </form>
    </main>
  );
};

export default SignUp;
