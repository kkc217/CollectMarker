const express= require('express');
const http = require('http');
const app = express();
// const ip = require('ip');

const hostname = 'localhost';
// const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer(app);

server.listen(port, hostname, () => {
    // console.log(`Server running at http://${ip.address()}:${port}`);
    console.log(`Server running at http://${hostname}:${port}`);
});

const indexRouter = require('./routes/index');

app.use('/', indexRouter);