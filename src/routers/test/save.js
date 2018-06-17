import db from '../../models/db';

const fields = {
    name: /^.{3,}$/,
    description: /^.*$/,
    isprivate: /^.*$/,
    islimited: /^.*$/,
    timelimit: /^[\d]+$/,
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

const shouldAbort = (err) => {
    if (err) {
        console.error('Error in transaction', err.stack)
        db.query('ROLLBACK', (err) => {
            if (err) {
                console.error('Error rolling back client', err.stack)
            }
        })
    }
    return !!err
};

const add = (data, success, error) => {
    db.query('BEGIN', err => {
        if (shouldAbort(err)) {
            return error('Saving failed');
        }
        const sql = 'INSERT INTO test (name, description, isprivate, islimited, timelimit, image, "user") VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id';
        const params = [
            data.name,
            data.description,
            data.isprivate,
            data.islimited,
            data.timelimit,
            data.image,
            data.user,
        ];
        db.query(sql, params, (err, res) => {
            if (shouldAbort(err)) {
                return error('Saving failed');
            }
            const id = res.rows[0].id;
            data.id = id;
            const sql = 'SELECT * FROM test WHERE id = $1';
            db.query(sql, [ id ], (err, res) => {
                if (shouldAbort(err)) {
                    return error('Saving failed');
                }
                addQuestions(data, success, error);
            });
        });
    });
};

const update = (data, success, error) => {
    db.query('BEGIN', err => {
        if (shouldAbort(err)) {
            return error('Saving failed');
        }
        const sql = 'update test set name = $1, description = $2, isprivate = $3, islimited = $4, timelimit = $5, image = $6, "user" = $7 where id = $8';
        const params = [
            data.name,
            data.description,
            data.isprivate,
            data.islimited,
            data.timelimit,
            data.image,
            data.user,
            data.id,
        ];
        db.query(sql, params, (err, res) => {
            if (shouldAbort(err)) {
                return error('Saving failed');
            }
            const id = data.id;
            const sql = 'delete from question WHERE test = $1';
            db.query(sql, [ id ], (err, res) => {
                if (shouldAbort(err)) {
                    return error('Saving failed');
                }
                const sql = 'delete from answer WHERE test = $1';
                db.query(sql, [ id ], (err, res) => {
                    if (shouldAbort(err)) {
                        return error('Saving failed');
                    }
                    addQuestions(data, success, error);
                });
            });
        });
    });
};

const addQuestions = (data, success, error) => {
    const id = data.id;
    for(let i = 0; i < data.questions.length; i++){
        let q = data.questions[i];
        const sql = 'INSERT INTO question (test, "text", image, weight) VALUES ($1,$2,$3,$4) RETURNING id';
        const params = [
            id,
            q.text,
            q.image,
            q.weight,
        ];
        db.query(sql, params, (err, res) => {
            if (shouldAbort(err)) {
                return error('Saving failed');
            }
            const qId = res.rows[0].id;
            for(let j = 0; j < q.answers.length; j++){
                let a = q.answers[j];
                const sql = 'INSERT INTO answer (question, "text", correct) VALUES ($1,$2,$3)';
                const params = [
                    qId,
                    a.text,
                    a.correct,
                ];
                db.query(sql, params, (err, res) => {
                    if (shouldAbort(err)) {
                        return error('Saving failed');
                    }
                    if(i === data.questions.length-1 && j === q.answers.length-1){
                        db.query('COMMIT', (err) => {
                            if (shouldAbort(err)) {
                                return error('Saving failed');
                            }
                            success(id);
                        })
                    }
                });
            }
        });
    }
};

export default (data, success, error) => {
    if(!validate(data)){
        error('Invalid data');
    }else{
        if(!data.id){
            add(data, success, error);
        }else{
            update(data, success, error);
        }
    }
}