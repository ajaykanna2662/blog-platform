const express = require("express");
const Post = require("../models/Post");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ======================
// CREATE POST (Protected)
// ======================
router.post("/", protect, async (req, res) => {
    try {
        const { title, content } = req.body;

        const post = await Post.create({
            title,
            content,
            author: req.user
        });

        res.status(201).json(post);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ======================
// GET ALL POSTS
// ======================
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.json(posts);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ======================
// GET SINGLE POST
// ======================
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "name email");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json(post);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ======================
// UPDATE POST (Protected)
// ======================
router.put("/:id", protect, async (req, res) => {
    try {
        const { title, content } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // only owner can update
        if (post.author.toString() !== req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        post.title = title || post.title;
        post.content = content || post.content;

        const updatedPost = await post.save();

        res.json(updatedPost);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ======================
// DELETE POST (Protected)
// ======================
router.delete("/:id", protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // only owner can delete
        if (post.author.toString() !== req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await post.deleteOne();

        res.json({ message: "Post deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;