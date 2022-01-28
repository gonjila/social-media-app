const { ApolloServer } = require("apollo-server");
const { PubSub } = require("graphql-subscriptions");
const mongoose = require("mongoose");

const typeDefs = require("./GraphQL/schema");
const listOfResolvers = require("./GraphQL/resolvers");
const { MONGODB } = require("./config.js");

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;

const resolvers = { ...listOfResolvers };
const context = ({ req }) => ({ req, pubsub });

const server = new ApolloServer({ typeDefs, resolvers, context });

mongoose
    .connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log("MongoDB connected");
        return server.listen({ port: PORT });
    })
    .then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    })
    .catch((err) => console.error(err));
