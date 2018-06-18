import {Client} from 'pg';
import config from '../config';

const client = new Client(config.db);
try{
    client.connect();
}catch (err){
    console.log(err);
}

export default client;