import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Calendar, Users, Star } from 'lucide-react';
import googleLogo from '../assets/google-logo.png';
import { useNavigate } from 'react-router-dom';
import { useSignUp, useClerk } from "@clerk/clerk-react";


const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    university: '',
    password: '',
    confirmPassword: ''
  });


const navigate = useNavigate();
  const { isLoaded,signUp, setActive } = useSignUp();


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

// Google OAuth handler
  const handleGoogleSignUp = async () => {
  if (!isLoaded) return;
  
  setIsGoogleLoading(true);
  try {
    // Clear auth state
    localStorage.removeItem("clerk-db-jwt");
    document.cookie.split(";").forEach(c => {
      if (c.trim().startsWith("__session=")) {
        document.cookie = c + "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      }
    });
    
    await signUp.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/", 
      redirectUrlComplete: "/"
    });
  } catch (err) {
    console.error("Google sign-up failed:", err);
    alert(err.errors?.[0]?.message || "Google sign-up failed");
  } finally {
    setIsGoogleLoading(false);
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isLoaded) {
    console.log("Clerk not loaded yet");
    return;
  }

  // Email validation
  const allowedDomainRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)*christuniversity\.in$/;
  if (!allowedDomainRegex.test(formData.email)) {
    alert("Please use your official Christ University email.");
    return;
  }

  // Password confirmation
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    // Start the sign-up process
    const result = await signUp.create({
      emailAddress: formData.email,
      password: formData.password,
    });

    // Check the result status
    if (result.status === 'complete') {
      // This means user is authenticated immediately (no email verification needed)
      console.log("Sign up complete, setting active session");
      await setActive({ session: result.createdSessionId });
      navigate("/"); // Redirect to home page
    } else {
      // This means additional steps are needed (like email verification)
      console.log("Sign up requires additional steps", result);
      // You might want to navigate to a verification page here
      // navigate('/verify-email');
    }
  } catch (err) {
    console.error("Signup error:", err);
    // More specific error messages
    if (err.errors && err.errors[0] && err.errors[0].code === 'form_identifier_exists') {
      alert("This email is already registered. Please sign in instead.");
      navigate('/sign-in');
    } else {
      alert(err.errors?.[0]?.longMessage || "Signup failed. Please try again.");
    }
  }
};


  const universities = [
    'Christ University'
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex">
      {/* Left Side - Branding & Features */}
      <div className="h-screen hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20">
            <Calendar className="w-32 h-32" />
          </div>
          <div className="absolute bottom-40 right-20">
            <Users className="w-24 h-24" />
          </div>
          <div className="absolute top-1/2 left-1/3">
            <Star className="w-16 h-16" />
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Evento</h1>
          <p className="text-xl text-purple-100">Discover amazing events at your university</p>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Discover Events</h3>
              <p className="text-purple-100">Find events that match your interests across universities</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Connect with Friends</h3>
              <p className="text-purple-100">See what events your friends are interested in</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Personalized Recommendations</h3>
              <p className="text-purple-100">Get curated events based on your preferences</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-purple-200 text-sm">Join thousands of students discovering amazing events</p>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full overflow-auto h-screen lg:w-1/2 flex items-start justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-600">Evento</h1>
            <p className="text-gray-600 mt-2">Discover amazing events at your university</p>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Join Evento</h2>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {/* University */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University
              </label>
              <select
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select your university</option>
                {universities.map((uni) => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center group"
            >
              Create Account
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-600 text-center">
              By creating an account, you agree to our{' '}
              <button type="button" className="text-purple-600 hover:underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="text-purple-600 hover:underline">
                Privacy Policy
              </button>
            </p>
          </form>

         {/* Social Login */}
<div className="mt-8">
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-300"></div>
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 bg-white text-gray-500">Or continue with</span>
    </div>
  </div>

  <div className="mt-6">
    <button
  onClick={handleGoogleSignUp}
  disabled={isGoogleLoading}
  className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
>
  <img
    className="w-5 h-5"
    src={googleLogo}
    alt="Google logo"
  />
  <span className="ml-2">
    {isGoogleLoading ? "Signing up..." : "Sign up with Google"}
  </span>
</button>
  </div>
</div>



          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button onClick={()=>{
                navigate("/sign-in")
              }} className="text-purple-600 hover:text-purple-700 font-medium">
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

