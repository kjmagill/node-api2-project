const express = require('express');
const postsRouter = require('./routers/postsRouter.js');
const server = express();

server.use(express.json());

server.use('/api/posts', postsRouter);

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`\n ** api on port: ${port} ** \n`));