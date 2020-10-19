const { ApolloServer } = require('apollo-server-koa');
const fs = require('fs');
const { resolve } = require('path');
const resolvers = require('./resolvers');
const logger = require('../logger');

const typeDefs = fs.readFileSync(resolve(process.cwd(), 'schema.graphql'), 'utf8');
const server = new ApolloServer({
    typeDefs,
    resolvers,
    logger,
    debug: process.env.NODE_ENV !== 'production',
    plugins: [],
});

module.exports = server.getMiddleware();
module.exports.path = server.graphqlPath;
