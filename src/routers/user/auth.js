import db from '../../models/db';
import sha256 from 'sha256';
import jwt from "jsonwebtoken";
import config from "../../config";

const fields = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    password: /^.{8,}$/,
};
const validate = data => {
    let valid = true;
    for (let field in fields){
        if(!fields.hasOwnProperty(field)){
            continue;
        }
        if(!data.hasOwnProperty(field) || !fields[field].test(data[field])){
            valid = false;
            break;
        }
    }
    return valid;
};

const authEmail = (data, success, error) => {
    if(!validate(data)){
        error('Invalid data');
    }else{
        const sql = 'SELECT * FROM "user" WHERE email = $1 AND active = $2';
        const params = [
            data.email,
            true
        ];
        db.query(sql, params, (err, res) => {
            if (err) {
                return error('Log in failed');
            }
            const user = res.rows[0];
            if(user.password !== sha256(data.password)){
                return error('Log in failed');
            }
            success(user);
        });
    }
};

const authToken = (token, success, error) => {
    jwt.verify(token, config.secret, (err, user) => {
        if (err) {
            return error('Invalid token');
        }
        const sql = 'SELECT * FROM "user" WHERE email = $1 AND active = $2';
        const params = [
            user.email,
            true
        ];
        db.query(sql, params, (err, res) => {
            if (err) {
                return error('Log in failed');
            }
            const user = res.rows[0];
            success(user);
        });
    });
};

export default (data, success, error) => {
    if(data.token){
        authToken(data.token, success, error);
    }else{
        authEmail(data, success, error);
    }
}