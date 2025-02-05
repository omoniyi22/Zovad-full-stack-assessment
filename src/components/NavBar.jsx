import React, { useState, useEffect } from "react";
import { Link, redirect } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/api";

const NavBar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/articles/tags`); 
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  return (
    <nav className="bg-blue-500 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
        <Link to="/" className="text-xl font-bold">NewsApp</Link>
        
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-gray-300">All Posts</Link>
          <Link to="/create" className="hover:text-gray-300">Create Post</Link>
          <Link to="/statistics" className="hover:text-gray-300">Statistics</Link>

          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!isDropdownOpen)} 
              className="bg-white text-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-gray-200 transition"
            >
              Tags
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <Link 
                      key={tag} 
                      to={`/news/tags/${tag.toLowerCase()}`} 
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => redirect(`/news/tags/${tag.toLowerCase()}`)}
                    >
                      {tag}
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-2 text-gray-500">No tags found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
