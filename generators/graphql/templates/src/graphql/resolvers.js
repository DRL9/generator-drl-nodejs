const resolvers = {
    Query: {
        users: async () => [{ name: 'Drl' }],
    },
};

module.exports = resolvers;
