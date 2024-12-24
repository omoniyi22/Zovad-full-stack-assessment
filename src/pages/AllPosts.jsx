import { API_URL } from "../utils/api";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown, FaTrash, FaEye } from "react-icons/fa";

const InfiniteScrollNews = () => {
    const [news, setNews] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeletedModal, setShowDeletedModal] = useState(false); // New state for "Deleted" modal
    const [selectedPost, setSelectedPost] = useState(null);
    const [likeLoader, setLikeLoader] = useState(null);
    const [loadedPage, setLoadedPage] = useState([])

    let [reactions, setReactions] = useState({})

    useEffect(() => {
        localStorage.setItem("latest_page", 1)
        localStorage.setItem("has_more", true)
        setNews([])
        fetchNews();
    }, [])


    const fetchNews = async () => {
        if (loading) return;
        if (!hasMore) return;
        setLoading(true);
        try {
            const latest_page = localStorage.getItem("latest_page")
            if (!loadedPage.includes(latest_page)) {
                const response = await axios.get(`${API_URL}/api/news/paginated/?page=${latest_page}`);
                let fresh_news = []
                console.log(response.data.news)
                for (let post of response.data.news) {
                    console.log({ post })
                    if (news.every((data) => data.id != post.id)) {
                        fresh_news.push(post)
                        console.log(true)
                    }
                }

                setNews((prev) => {
                    if (localStorage.getItem("has_more") != false) {

                        return [...prev, ...fresh_news]
                    } else {
                        return prev
                    }
                });


                const { has_more, current_page } = response.data;
                setHasMore(has_more);
                console.log({ has_more, current_page })
                setLoadedPage((data => [...data, latest_page]))
                setPage((page) => {
                    const newpage = page + 1

                    console.log({ current_page, page })

                    localStorage.setItem("latest_page", newpage)
                    localStorage.setItem("has_more", has_more)
                    console.log({
                        lat:
                            localStorage.getItem("latest_page"),
                        la:
                            localStorage.getItem("has_more"),
                    })
                    return newpage
                });
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch news:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    function getUniqueById(array) {
        const uniqueMap = new Map();

        for (const item of array) {
            if (!uniqueMap.has(item.id)) {
                uniqueMap.set(item.id, item);
            }
        }

        return Array.from(uniqueMap.values());
    }

    const handleScroll = () => {
        console.log({ loca: localStorage.getItem("has_more") })
        if (localStorage.getItem("has_more") == false) {
            console.log(hasMore, loading)
        } else
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 10
            ) {
                if (localStorage.getItem("has_more") != false) {  // Only fetch more if `hasMore` is true and `loading` is false
                    fetchNews();
                }
            }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle Like
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

                    setNews((prev) =>
                        prev.map((post) =>
                            post.id === id ? { ...post, dislike: dislike_count, like: like_count } : post
                        )
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

                        setNews((prev) =>
                            prev.map((post) =>
                                post.id === id ? { ...post, like: like_count, dislike: new_post.dislike } : post
                            )
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
                        setNews((prev) =>
                            prev.map((post) =>
                                post.id === id ? { ...post, like: like_count, dislike: new_post.dislike } : post
                            )
                        );

                        setReactions(data => ({ ...data, [id]: { dislike: 0, like: 0 } }))
                    }
                }
            } catch (error) {
                console.error("Failed to like the post:", error);
            } finally {
                setLikeLoader(false)
            }
    };

    // Handle Dislike
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

                    setNews((prev) =>
                        prev.map((post) =>
                            post.id == id ? { ...post, dislike: dislike_count, like: like_count } : post
                        )
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


                        setNews((prev) =>
                            prev.map((post) =>
                                post.id === id ? { ...post, dislike: count, like: new_post.like } : post
                            )
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

                        setNews((prev) =>
                            prev.map((post) =>
                                post.id === id ? { ...post, dislike: dislike_count, like: new_post.like } : post
                            )
                        );

                        setReactions(data => ({ ...data, [id]: { dislike: 0, like: 0 } }))
                    }
                }

                setLikeLoader(false)

            } catch (error) {
                console.error("Failed to like the post:", error);
                setLikeLoader(false)
            }
    };

    // Open Delete Modal
    const openDeleteModal = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    // Handle Delete
    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/api/news/${selectedPost.id}`);
            setNews((prev) => prev.filter((post) => post.id !== selectedPost.id));
            setShowModal(false); // Close delete confirmation modal
            setShowDeletedModal(true); // Open "Deleted" modal

            // Automatically close "Deleted" modal after 2 seconds
            setTimeout(() => { setShowDeletedModal(false); }, 2000);

        } catch (error) {
            console.error("Failed to delete the post:", error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-2xl mb-4">All Posts</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {news && getUniqueById(news).map((post) => (
                        <div key={post.id} className="border p-4 rounded shadow-sm flex my-4">
                            {post.picture && (
                                <img
                                    src={post.picture}
                                    alt={post.title}
                                    className="w-1/3 min-h-48 border object-cover rounded mr-4"
                                />
                            )}
                            <div className="flex-1">
                                <h3 className="text-xl font-bold">{post.title}</h3>
                                <p className="text-sm text-gray-600">{post.text.slice(0, 150)}...</p>
                                <Link to={`/post/${post.id}`} className="text-blue-500 mt-2 inline-block">
                                    Read more
                                </Link>
                                <div className="mt-4 flex items-center space-x-4">
                                    <FaEye className={`mr-2 text-black `} /> {post.views}

                                    <button
                                        className="px-3 py-1 flex items-center bg-green-500 text-white rounded"
                                        onClick={() => handleLike(post.id)}
                                    >
                                        <FaThumbsUp className={`mr-2 ${reactions[post.id] && reactions[post.id].like ? "text-green-600" : "text-white"}`} /> ({post.like})

                                    </button>
                                    <button
                                        className="px-3 py-1 flex items-center bg-red-500 text-white rounded"
                                        onClick={() => handleDislike(post.id)}
                                    >
                                        <FaThumbsDown className={`mr-2 ${reactions[post.id] && reactions[post.id].dislike ? "text-red-600" : "text-white"}`} /> ({post.dislike})

                                    </button>
                                    <button
                                        className="px-3 py-1 flex items-center bg-gray-500 text-white rounded"
                                        onClick={() => openDeleteModal(post)}
                                    >
                                        <FaTrash className="mr-2" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {loading && <p>Loading...</p>}

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

            {/* Deleted Confirmation Modal */}
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
