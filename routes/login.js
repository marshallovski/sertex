const fastify = require('fastify')({ logger: false });

async function login(fastify, options) {
    fastify.get('/login', async (request, reply) => {
        return reply.view('/views/login.html');
    });
}

module.exports = login;