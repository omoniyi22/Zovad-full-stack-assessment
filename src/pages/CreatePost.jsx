import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/api';
import { useNavigate } from 'react-router-dom';


const FormComponent = () => {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    picture: null,
    tags: [],
  });

  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagChange = (e) => {
    const options = Array.from(e.target.options);
    const selectedTags = options.filter(option => option.selected).map(option => option.value);
    setFormData({ ...formData, tags: selectedTags });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, picture: e.target.files[0] });
  };

  const [loader, setLoader] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoader(true)
      const formDataForCloudinary = new FormData();
      formDataForCloudinary.append('file', formData.picture);
      formDataForCloudinary.append('upload_preset', 'new-present');
      formDataForCloudinary.append('cloud_name', 'benny-tech');

      const cloudinaryResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/benny-tech/image/upload',
        formDataForCloudinary
      );

      const imageUrlFromCloudinary = cloudinaryResponse.data.secure_url;
      setImageUrl(imageUrlFromCloudinary);

      const finalData = {
        title: formData.title,
        text: formData.text,
        picture: imageUrlFromCloudinary,
        tags: formData.tags, 
      };

      let new_post = await axios.post(`${API_URL}/api/articles`, finalData);
      new_post = await new_post.data


      navigate(`/news/id/${new_post.id}`)
    } catch (error) {
      console.error('Error submitting the form:', error);
    } finally {
      setLoader(false)

    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Submit Your Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-gray-700 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>


        <div>
          <label className="block text-gray-700 font-medium">Text</label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            className="border w-full px-2 py-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Picture</label>
          <input
            type="file"
            name="picture"
            onChange={handleFileChange}
            className="w-full border text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Tags</label>
          <select
            name="tags"
            multiple
            onChange={handleTagChange}
            className="w-full border p-2 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="politics">Politics</option>
            <option value="economics">Economics</option>
            <option value="social">Social</option>
            <option value="music">Music</option>
            <option value="technology">Technology</option>
          </select>
          <small className="text-gray-500">Hold Ctrl (Windows) or Command (Mac) to select multiple tags.</small>
        </div>

        <div>
          <button
            type="submit"
            disabled={loader}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            {!loader ? "Submit" : "loading..."}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormComponent;
