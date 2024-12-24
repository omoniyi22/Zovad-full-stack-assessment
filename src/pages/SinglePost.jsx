import { API_URL } from "../utils/api";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import { FaThumbsUp, FaThumbsDown, FaTrash, FaEye } from "react-icons/fa";
import { useParams } from "react-router-dom";


const InfiniteScrollNews = () => {
  const navigate = useNavigate();
  const { id } = useParams()
  const [news, setNews] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likeLoader, setLikeLoader] = useState(null);
  const [loadedPage, setLoadedPage] = useState([])

  let [reactions, setReactions] = useState({})


  const fetchCalled = useRef(false);


  useEffect(() => {
    if (fetchCalled.current) return;

    const fetchStats = async () => {
      if (loading) return;
      if (!hasMore) return;
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/news/view/${id}`);
        setNews(response.data)
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchCalled.current = true; // Mark fetch as called
  }, []);


  function getUniqueById(array) {
    const uniqueMap = new Map();

    for (const item of array) {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    }

    return Array.from(uniqueMap.values());
  }


 


  const handleLike = async (id) => {
    if (likeLoader != true)
      try {
        setLikeLoader(true)
        let reaction = reactions[id] ? reactions[id] :
          {
            like: reactions[id] ? reactions[id].like : 0,
            dislike: reactions[id] ? reactions[id].dislike : 0
          }

        if (reaction && reaction.dislike == 1) {

          let like_count = (await axios.put(`${API_URL}/api/news/reactions`, {
            action: "like",
            "id": id,
            sign: "+"
          })).data.count;


          let dislike_count = (await axios.put(`${API_URL}/api/news/reactions`, {
            action: "dislike",
            "id": id,
            sign: "-"
          })).data.count

          setNews((post) =>
            post.id === id ? { ...post, dislike: dislike_count, like: like_count } : post
          );

          setReactions(data => ({ ...data, [id]: { like: 1, dislike: 0 } }))
        } else {
          if (reaction && reaction.like == 0) {
            let like_count = (await axios.put(`${API_URL}/api/news/reactions`, {
              action: "like",
              "id": id,
              sign: "+"
            })).data.count;

            let new_post = (await axios.get(`${API_URL}/api/news/${id}`)).data;

            setNews((post) =>
              post.id === id ? { ...post, like: like_count, dislike: new_post.dislike } : post
            );

            setReactions(data => ({ ...data, [id]: { like: 1, dislike: 0 } }))
          }
          else {
            let like_count = await (await axios.put(`${API_URL}/api/news/reactions`, {
              action: "like",
              "id": id,
              sign: "-"
            })).data.count;

            let new_post = await (await axios.get(`${API_URL}/api/news/${id}`)).data;
            setNews((post) =>
              post.id === id ? { ...post, like: like_count, dislike: new_post.dislike } : post
            )

            setReactions(data => ({ ...data, [id]: { dislike: 0, like: 0 } }))
          }
        }
      } catch (error) {
        console.error("Failed to like the post:", error);
      } finally {
        setLikeLoader(false)
      }
  };

  const handleDislike = async (id) => {
    if (!likeLoader)
      try {

        setLikeLoader(true)
        let reaction = reactions[id] ? reactions[id] :
          {
            like: reactions[id] ? reactions[id].like : 0,
            dislike: reactions[id] ? reactions[id].dislike : 0
          }

        if (reaction && reaction.like == 1) {

          let dislike_count = (await (axios.put(`${API_URL}/api/news/reactions`, {
            action: "dislike",
            "id": id,
            sign: "+"
          }))).data.count;

          let like_count = await (await axios.put(`${API_URL}/api/news/reactions`, {
            action: "like",
            "id": id,
            sign: "-"
          })).data.count;

          setNews((post) =>
            post.id == id ? { ...post, dislike: dislike_count, like: like_count } : post
          );

          setReactions(data => ({ ...data, [id]: { dislike: 1, like: 0 } }))


        } else {
          if (reaction && reaction.dislike == 0) {
            let count = await (await axios.put(`${API_URL}/api/news/reactions`, {
              action: "dislike",
              "id": id,
              sign: "+"

            })).data.count;

            let new_post = await (await axios.get(`${API_URL}/api/news/${id}`)).data;


            setNews((post) =>
              post.id === id ? { ...post, dislike: count, like: new_post.like } : post
            );

            setReactions(data => ({ ...data, [id]: { dislike: 1, like: 0 } }))
          }
          else {
            let dislike_count = await (await axios.put(`${API_URL}/api/news/reactions`, {
              action: "dislike",
              "id": id,
              sign: "-"
            })).data.count;
            let new_post = await (await axios.get(`${API_URL}/api/news/${id}`)).data;

            setNews((post) =>
              post.id === id ? { ...post, dislike: dislike_count, like: new_post.like } : post
            )

            setReactions(data => ({ ...data, [id]: { dislike: 0, like: 0 } }))
          }
        }

        setLikeLoader(false)

      } catch (error) {
        console.error("Failed to like the post:", error);
        setLikeLoader(false)
      }
  };

  const openDeleteModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/news/${selectedPost.id}`);

      setShowModal(false);
      setShowDeletedModal(true);

      setTimeout(() => { setShowDeletedModal(false); navigate("/"); }, 2000);


    } catch (error) {
      console.error("Failed to delete the post:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 ">
      <h2 className="text-2xl mb-4">Single News</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news && news.id && <div key={news.id} className="border p-4 rounded shadow-sm flex flex-col">
            {news.picture && (
              <img
                src={news.picture}
                alt={news.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}

            <div className="mt-auto flex items-center space-x-4">
              <FaEye className={`mr-2 text-black`} /> {news.views}
              <button
                className={`px-3 py-1 flex items-center bg-green-500 text-white rounded`}
                onClick={() => handleLike(news.id)}
              >
                <FaThumbsUp className={`mr-2 ${reactions[id] && reactions[id].like ? "text-green-600" : "text-white"}`} /> ({news.like})
              </button>
              <button
                className="px-3 py-1 flex items-center bg-red-500 text-white rounded"
                onClick={() => handleDislike(news.id)}
              >
                <FaThumbsDown className={`mr-2 ${reactions[id] && reactions[id].dislike ? "text-red-600" : "text-white"}`} /> ({news.dislike})
              </button>
              <button
                className="px-3 py-1 flex items-center bg-gray-500 text-white rounded"
                onClick={() => openDeleteModal(news)}
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
            <div>
              <h3 className="text-lg font-bold mt-3">{news.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{news.text}</p>
            </div>
          </div>
          }
        </div>
      </div>
      {loading && <p>Loading..</p>}

      {/* Delete Confirmation Modal */}
      {
        showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-4">
                Are you sure you want to delete{" "}
                <strong>{selectedPost?.title}</strong>?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-black rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )
      }

      {
        showDeletedModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg text-center">
              <h2 className="text-lg font-bold">Post Deleted</h2>
              <p>The post has been successfully deleted.</p>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default InfiniteScrollNews;
