import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import {TestRouter, UserRouter, FileUploadRouter} from './routers';

const app = express();
app.use(bodyParser.json({ type: 'application/json' }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const server = http.Server(app);
const IP = '127.0.0.1';
const port = 8000;

app.get('/', (req, res) => {
    res.end();
});

app.use('/api/test', TestRouter);
app.use('/api/user', UserRouter);
app.use('/api/file-upload', FileUploadRouter);

server.listen(port, IP, () => {
    console.log('listening on *: ' + port);
});