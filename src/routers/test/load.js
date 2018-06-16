import db from '../../models/db';

export default (id, success, error) => {
    const sql = 'SELECT * FROM test WHERE id = $1';
    db.query(sql, [id], (err, res) => {
        if (err) {
            return error('Network Error');
        }
        success(res.rows[0]);
    });
}