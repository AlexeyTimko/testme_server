import db from '../../models/db';
import config from '../../config';

export default (data, success, error) => {
    let params = [];
    let where = ['where true'];
    if (data.user) {
        params.push(data.user);
        where.push(`"user" = $${params.length}`);
    }
    if (data.search) {
        where.push(`(lower("name") like lower('%${data.search}%') or lower("description") like lower('%${data.search}%'))`);
    }
    const page = data.page || 1;
    const sql = `select * from test ${where.join(' and ')} order by id desc limit ${config.itemsPerPage} offset ${(page - 1) * config.itemsPerPage}`;
    db.query(sql, params, (err, res) => {
        if (err) {
            return error('Network Error');
        }
        success(res.rows);
    });
}