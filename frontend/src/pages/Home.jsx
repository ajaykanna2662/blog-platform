import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Home = () => {
  const [posts, setPosts] = useState([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const deletePost = async (id) => {
    try {
      await API.delete(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting post");
    }
  };

  return (
    <>
      <section className="hero-section">
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "20px",
            color: "#111",
          }}
        >
          Welcome to BlogSphere 🚀
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#555",
            maxWidth: "700px",
            margin: "auto",
            lineHeight: "1.6",
          }}
        >
          Share your ideas, write amazing articles, and connect with readers
          around the world.
        </p>

        <div style={{ marginTop: "30px" }}>
          <button
            onClick={() => navigate("/create")}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "14px 28px",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Start Writing
          </button>
        </div>
      </section>

      <div
        style={{
          maxWidth: "1000px",
          margin: "auto",
          padding: "20px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "32px",
          }}
        >
          Latest Posts
        </h2>

        {posts.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "#666",
            }}
          >
            No blog posts available
          </p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="blog-card">
              <h2>{post.title}</h2>

              <p>{post.content}</p>

              <small>✍️ By {post.author?.name}</small>

              <br />
              <br />

              {token && post.author?._id === userId && (
                <>
                  <button
                    onClick={() =>
                      navigate(`/edit/${post._id}`)
                    }
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deletePost(post._id)
                    }
                    style={{
                      background: "#e53935",
                      color: "#fff",
                      border: "none",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Home;