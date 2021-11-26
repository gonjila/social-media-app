const Post = {
    likeCount: (parent, args, ctx) => parent.likes.length,
    commentCount: (parent, args, ctx) => parent.comments.length,
};

module.exports = Post;
