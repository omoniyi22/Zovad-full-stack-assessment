import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
        <Link to="/" className="text-xl font-bold">NewsApp</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-300">All Posts</Link>
          <Link to="/create" className="hover:text-gray-300">Create Post</Link>
          <Link to="/statistics" className="hover:text-gray-300">Statistics</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;