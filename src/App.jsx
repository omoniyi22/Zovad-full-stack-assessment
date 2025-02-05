import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import AllPosts from "./pages/AllPosts";
import CreatePost from "./pages/CreatePost";
import SinglePost from "./pages/SinglePost";
import Tags from "./pages/Tags";
import Statistics from "./pages/Statistics";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <NavBar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<AllPosts />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/news/id/:id" element={<SinglePost />} />
          <Route path="/news/tags/:tag" element={< Tags />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
