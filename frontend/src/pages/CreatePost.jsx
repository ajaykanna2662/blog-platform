import { useState } from "react";
import API from "../api/axios";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/posts",
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

      setMessage("Post published successfully 🚀");
      setTitle("");
      setContent("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Error creating post"
      );
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-card">
        <h1>Create New Post ✍️</h1>

        <p className="editor-subtitle">
          Share your knowledge with the world
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
            Publish Post 🚀
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

export default CreatePost;