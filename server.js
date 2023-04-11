const fastify = require('fastify')({ logger: false });
const path = require('path');

const port = 80;

fastify.register(require('@fastify/view'), {
    engine: {
        ejs: require('ejs')
    }
});

fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'static'),
    prefix: '/'
});

// Routes
fastify.register(require('./routes/home.js'), { prefix: '/' });
fastify.register(require('./routes/login.js'), { prefix: '/' });

async function start() {
    try {
        await fastify.listen({ port: port });
        console.log(`sertex is running on http://${fastify.server.address().address}:${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        return process.exit(1);
    }
}

start();
