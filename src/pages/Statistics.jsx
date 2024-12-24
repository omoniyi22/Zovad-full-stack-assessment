import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/api";

const Statistics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/news/statistics`);
        setStats(response.data);
        console.log({ data: response.data })
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Statistics</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="p-4 bg-white rounded shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total News</h3>
          <p className="text-gray-900 text-xl">{stats.total_news}</p>
        </div>
        <div className="p-4 bg-white rounded shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Average Views</h3>
          <p className="text-gray-900 text-xl">{stats.avg_views}</p>
        </div>
        <div className="p-4 bg-white rounded shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Average Likes</h3>
          <p className="text-gray-900 text-xl">{stats.avg_likes}</p>
        </div>
        <div className="p-4 bg-white rounded shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Average Dislikes</h3>
          <p className="text-gray-900 text-xl">{stats.avg_dislikes}</p>
        </div>
      </div>
      {stats.most_viewed && (
        <div className="mt-6 p-4 bg-white rounded shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Most Viewed Post</h3>
          <p className="text-gray-700">
            <span className="font-semibold">Title:</span> {stats.most_viewed.title}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Views:</span> {stats.most_viewed.views}
          </p>
        </div>
      )}
    </div>
  );
};

export default Statistics;
