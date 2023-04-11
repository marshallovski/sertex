const fastify = require('fastify')({ logger: false });
const fs = require('fs');
const path = require('path');

async function home(fastify, options) {
    fastify.get('/', async (request, reply) => {
        return reply.view('/views/index.ejs', {
            cssComponentsFiles: fs.readdirSync('./static/css/components/'),
            cssFiles: fs.readdirSync('./static/css/').filter(f => f.split(".").pop() === "css")
        });
    });
}

module.exports = home;