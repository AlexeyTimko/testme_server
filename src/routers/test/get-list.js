import db from '../../models/db';

export default (data, success, error) => {
    let params = [];
    let where = ['where 1'];
    if (data.user) {
        params.push(data.user);
        where.push(`user = $${params.length}`);
    }
    if (data.search) {
        where.push(`(name like '%${data.search}%' or description like '%${data.search}%')`);
    }
    const page = data.page || 1;
    const sql = `select * from test ${where.join(' and ')} order by id desc limit 20 offset ${(page - 1) * 20}`;
    db.query(sql, params, (err, res) => {
        if (err) {
            return error('Network Error');
        }
        success(res.rows);
    });
}