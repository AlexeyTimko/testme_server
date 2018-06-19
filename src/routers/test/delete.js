import db from '../../models/db';

export default (test, success, error) => {
    let questions = [0];
    for (let i = 0; i < test.questions.length; i++){
        questions.push(test.questions[i].id);
    }
    const sql = 'delete from answer where question in ($1)';
    db.query(sql, [questions], (err, res) => {
        if (err) {
            console.log(err.message);
            return error('Network Error');
        }
        const sql = 'delete from question where test = $1';
        db.query(sql, [test.id], (err, res) => {
            if (err) {
                return error('Network Error');
            }
            const sql = 'delete from test where id = $1';
            db.query(sql, [test.id], (err, res) => {
                if (err) {
                    return error('Network Error');
                }
                success();
            });
        });
    });
}