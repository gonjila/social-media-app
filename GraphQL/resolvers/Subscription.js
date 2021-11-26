const Subscription = {
    newPost: (parent, args, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
};

module.exports = Subscription;
