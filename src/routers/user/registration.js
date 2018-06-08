import db from '../../models/db';
import sha256 from 'sha256';

const fields = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    password: /^.{8,}$/,
    passwordConfirm: /^.{8,}$/,
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
    return valid && data['passwordConfirm'] === data['password'];
};

export default (data, success, error) => {
    if(!validate(data)){
        error('Invalid data');
    }else{
        const sql = 'INSERT INTO user (email, password) VALUES ($1,$2) RETURNING id';
        const params = [
            data.email,
            sha256(data.password)
        ];
        db.query(sql, params, (err, res) => {
            if (err) {
                console.log(err);
                return error('Registration failed');
            }
            const id = res.rows[0].id;
            const sql = 'SELECT * FROM user WHERE id = $1';
            db.query(sql, [ id ], (err, res) => {
                if (err) {
                    console.log(err);
                    return error('Registration failed');
                }
                success(id);
            });
        });
    }
}