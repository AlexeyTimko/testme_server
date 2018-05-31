import {Client} from 'pg';

const client = new Client({
    user: 'testme',
    host: 'localhost',
    database: 'testme',
    password: 'Jcjpyfybt34',
    port: 5432,
});
try{
    client.connect();
}catch (err){
    console.log(err);
}

export default client;