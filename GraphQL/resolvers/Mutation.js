const { UserInputError, AuthenticationError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const Post = require("../../models/Post");
const { validateRegisterInput, validateLoginInput } = require("../../util/validators");
const checkAuth = require("../../util/check-auth");
const { SECRET_KEY } = require("../../config");

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
    );
};

const Mutation = {
    register: async (parent, { registerInputs: { username, email, password, confirmPassword } }, ctx, info) => {
        // Validate user data
        const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
        if (!valid) {
            throw new UserInputError("Errors", { errors });
        }

        // Make sure user doesn`t already exist
        const user = await User.findOne({ username });
        if (user) {
            throw new UserInputError("Username is taken", {
                errors: {
                    username: "this username is taken",
                },
            });
        }

        // Hash password and create an auth token
        password = await bcrypt.hash(password, 12);

        const newUser = new User({
            email,
            username,
            password,
            createdAt: new Date().toISOString(),
        });
        const res = await newUser.save();
        const token = generateToken(res);

        return {
            ...res._doc,
            id: res._id,
            token,
        };
    },
    login: async (parent, { username, password }, ctx) => {
        const { errors, valid } = validateLoginInput(username, password);

        if (!valid) {
            throw new UserInputError("Errors", { errors });
        }

        const user = await User.findOne({ username });
        if (!user) {
            errors.general = "User not found";
            throw new UserInputError("User not found", { errors });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            errors.general = "Wrong credentials";
            throw new UserInputError("Wrong credentials", { errors });
        }

        const token = generateToken(user);

        return {
            ...user._doc,
            id: user._id,
            token,
        };
    },
    createPost: async (parent, { body }, ctx) => {
        const user = checkAuth(ctx);
        if (body.trim() === "") {
            throw new Error("Post body must not be empty!");
        }
        const newPost = new Post({
            body,
            user: user.id,
            username: user.username,
            createdAt: new Date().toISOString(),
        });
        const post = await newPost.save();

        ctx.pubsub.publish("NEW_POST", {
            newPost: post,
        });

        return post;
    },
    deletePost: async (parent, { postId }, ctx) => {
        const user = checkAuth(ctx);
        console.log("user", user);
        console.log("Post", Post.findById(postId));
        try {
            const post = await Post.findById(postId);
            if (user.username === post.username) {
                await post.delete();
                return "Post deleted successfully";
            } else {
                throw new AuthenticationError("Action not allowed!");
            }
        } catch (err) {
            throw new Error(err);
        }
    },
    createComment: async (parent, { postId, body }, ctx) => {
        const { username } = checkAuth(ctx);

        if (body.trim() === "") {
            throw new UserInputError("Empty comment", {
                errors: { body: "Comment body must not empty!" },
            });
        }
        const post = await Post.findById(postId);
        if (post) {
            post.comments.unshift({
                body,
                username,
                createdAt: new Date().toISOString(),
            });
            await post.save();
            return post;
        } else {
            throw new UserInputError("Post not found!");
        }
    },
    deleteComment: async (parent, { postId, commentId }, ctx) => {
        const { username } = checkAuth(ctx);

        const post = await Post.findById(postId);
        if (post) {
            const commentIndex = post.comments.findIndex((com) => com.id === commentId);
            if (post.comments[commentIndex].username === username) {
                post.comments.splice(commentIndex, 1);
                await post.save();
                return post;
            } else {
                throw new AuthenticationError("Action not allowed");
            }
        } else {
            throw new UserInputError("Post not found");
        }
    },
    likePost: async (parent, { postId }, ctx) => {
        const { username } = checkAuth(ctx);

        const post = await Post.findById(postId);
        if (post) {
            if (post.likes.find((like) => like.username === username)) {
                // Post already liked, unlike it
                post.likes = post.likes.filter((likes) => likes.username !== username);
            } else {
                // not liked, like it
                post.likes.push({
                    username,
                    createdAt: new Date().toISOString(),
                });
            }
            await post.save();
            return post;
        } else {
            throw new UserInputError("Post not found");
        }
    },
};

module.exports = Mutation;
