const { ApolloServer } = require("apollo-server");
const { PubSub } = require("graphql-subscriptions");
const mongoose = require("mongoose");

const typeDefs = require("./GraphQL/schema");
const listOfResolvers = require("./GraphQL/resolvers");
const { MONGODB } = require("./config.js");

const pubsub = new PubSub();

const resolvers = { ...listOfResolvers };
const context = ({ req }) => ({ req, pubsub });

const server = new ApolloServer({ typeDefs, resolvers, context });
// sTmQMpdwv6q2UENi
mongoose
    .connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log("MongoDB connected");
        return server.listen({ port: 5000 });
    })
    .then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
