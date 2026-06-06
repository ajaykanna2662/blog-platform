import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

const EditPost = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await API.get(`/posts/${id}`);

      setTitle(res.data.title);
      setContent(res.data.content);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/posts/${id}`,
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Post updated successfully ✅");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Error updating post"
      );
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-card">
        <h1>Edit Post ✏️</h1>

        <p className="editor-subtitle">
          Update your article
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter post title..."
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="editor-title"
          />

          <textarea
            placeholder="Write your content here..."
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            className="editor-content"
          />

          <button
            type="submit"
            className="publish-btn"
          >
            Update Post ✅
          </button>
        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default EditPost;