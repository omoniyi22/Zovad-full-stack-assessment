import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import AllPosts from "./pages/AllPosts";
import CreatePost from "./pages/CreatePost";
import SinglePost from "./pages/SinglePost";
import Statistics from "./pages/Statistics";

const App = () => {
  return (
    <Router>
      <NavBar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<AllPosts />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
