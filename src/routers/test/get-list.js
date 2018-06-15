import db from '../../models/db';

export default (data, success, error) => {
    const sql = 'SELECT * FROM test ORDER BY id DESC';
    db.query(sql, [], (err, res) => {
        if (err) {
            return error('Network Error');
        }
        success(res.rows);
    });
}