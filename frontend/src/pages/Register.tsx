import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import api from "../services/api"; // Assuming you have this service
import { useAuth } from "../context/AuthContext"; // Import useAuth if needed, or remove

// Import icons
import {
  UserPlusIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

// A simple spinner component (re-using from the Login component)
const LoadingSpinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added for validation
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // --- Best Practice: Client-side password match check ---
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Use the 'api' service for consistency
      const res = await api.post("/auth/register", {
        email,
        password,
      });

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500); // Give user time to read
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/30">
        
        {/* Logo/Icon Header */}
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-purple-600 rounded-full shadow-lg">
            <UserPlusIcon className="h-8 w-8 text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Your Account
        </h2>

        {/* Improved Success Message */}
        {success && (
          <div
            className="flex items-center p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-300"
            role="alert"
          >
            <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Improved Error Message */}
        {error && (
          <div
            className="flex items-center p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300"
            role="alert"
          >
            <ExclamationTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Email Field with Icon */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-2 pl-10 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@example.com"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field with Icon and Toggle */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                minLength={6} // Added basic password rule
                className="w-full px-4 py-2 pl-10 pr-10 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-purple-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-gray-700 font-medium mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                required
                className="w-full px-4 py-2 pl-10 pr-10 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-purple-600"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button with Loading State */}
          <button
            type="submit"
            disabled={loading || !!success} // Disable if loading or success
            className="w-full py-3 mt-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center disabled:bg-purple-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            {loading ? <LoadingSpinner /> : null}
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* Use Link for Navigation */}
        <p className="mt-6 text-center text-gray-700 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}