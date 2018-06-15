import db from '../../models/db';

const fields = {
    name: /^.{3,}$/,
    description: /^.*$/,
    isPrivate: /^.*$/,
    isLimited: /^.*$/,
    timeLimit: /^[\d]+$/,
    image: /^.*$/,
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

export default (data, success, error) => {
    if(!validate(data)){
        error('Invalid data');
    }else{
        const sql = 'INSERT INTO test (name, description, isprivate, islimited, timelimit, image, user) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id';
        const params = [
            data.name,
            data.description,
            data.isPrivate,
            data.isLimited,
            data.timeLimit,
            data.image,
            data.user,
        ];
        db.query(sql, params, (err, res) => {
            if (err) {
                return error('Saving failed');
            }
            const id = res.rows[0].id;
            const sql = 'SELECT * FROM test WHERE id = $1';
            db.query(sql, [ id ], (err, res) => {
                if (err) {
                    return error('Saving failed');
                }
                success(id);
            });
        });
    }
}