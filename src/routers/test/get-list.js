import db from '../../models/db';

export default (data, success, error) => {
    const sql = 'SELECT * FROM test';
    db.query(sql, [], (err, res) => {
        if (err) {
            return error('Network Error');
        }
        success(res.rows);
    });
}