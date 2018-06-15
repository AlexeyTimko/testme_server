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

export default (data, success, error) => {
    if(!validate(data)){
        error('Invalid data');
    }else{
        db.query('BEGIN', err => {
            if (shouldAbort(err)) {
                return error('Saving failed');
            }
            const sql = 'INSERT INTO test (name, description, isprivate, islimited, timelimit, image, "user") VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id';
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
                if (shouldAbort(err)) {
                    return error('Saving failed');
                }
                const id = res.rows[0].id;
                const sql = 'SELECT * FROM test WHERE id = $1';
                db.query(sql, [ id ], (err, res) => {
                    if (shouldAbort(err)) {
                        return error('Saving failed');
                    }
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
                });
            });
        });
    }
}