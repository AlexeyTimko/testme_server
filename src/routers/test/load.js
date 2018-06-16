import db from '../../models/db';

export default (id, success, error) => {
    const sql = '' +
        'SELECT row_to_json(t) ' +
        'FROM ( SELECT t.*, json_agg(json_build_object(q.*)) as questions ' +
            'FROM test t ' +
                'JOIN question q ON t.id = q.test ' +
        'WHERE t.id = $1 GROUP BY t.id) t';
    db.query(sql, [id], (err, res) => {
        if (err) {
            return error('Network Error');
        }
        let test = res.rows[0];
        success(test);
    });
}