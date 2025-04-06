import React from "react";
import Logo from "./shared/Logo";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const user = true; 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
    
      await axios.post("http://localhost:8000/api/users/logout", {}, {
        withCredentials: true, 
      });
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.response?.data?.message || "Logout failed.");
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white dark:bg-gray-900 shadow-md">
    
      <Link to="/" className="flex items-center">
        <Logo className="h-8 w-auto" /> 
      </Link>
      <div className="hidden md:flex space-x-6 text-gray-700 dark:text-gray-300">
        <Link to="/" className="hover:text-blue-500 transition-colors ">Home</Link>
        <Link to="/about" className="hover:text-blue-500 transition-colors">About</Link>
        <Link to="/contact" className="hover:text-blue-500 transition-colors">Contact</Link>
      </div>

      
      {user ? (
        <Popover>
          <PopoverTrigger>
            <Avatar className="cursor-pointer h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2">
            <Link to="/profile" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-700 rounded"
            >
              Logout
            </button>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="flex gap-4">
          <Link to="/login">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
