const Post = require("../../models/Post");

const Query = {
    getPosts: async () => {
        try {
            const Posts = await Post.find().sort({ createdAt: -1 });
            return Posts;
        } catch (err) {
            throw new Error(err);
        }
    },
    getPost: async (parent, { postId }, ctx) => {
        try {
            const post = await Post.findById(postId);
            if (post) {
                return post;
            } else {
                throw new Error("Post not found!");
            }
        } catch (err) {
            throw new Error(err);
        }
    },
};

module.exports = Query;
