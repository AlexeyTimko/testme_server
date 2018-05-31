import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import {TestRouter} from './routers';

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
const IP = '165.227.135.155';
const port = 8000;

app.get('/', (req, res) => {
    res.end();
});

app.use('/test', TestRouter);

server.listen(port, IP, () => {
    console.log('listening on *: ' + port);
});