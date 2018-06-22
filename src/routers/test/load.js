import db from '../../models/db';

export default (id, success, error) => {
    let params = [id];
    let sql = 'select\n' +
        '  t.*,\n' +
        '  json_agg(\n' +
        '      json_build_object(\n' +
        '          \'id\', q.id, \'text\', q.text, \'image\', q.image, \'weight\', q.weight, \'answers\',\n' +
        '          (\n' +
        '            select json_agg(json_build_object(\'id\', a.id, \'text\', a.text, \'correct\', a.correct))\n' +
        '            from answer a\n' +
        '            where a.question = q.id\n' +
        '            group by q.id\n' +
        '          )\n' +
        '      )\n' +
        '  ) as questions\n' +
        'from test t\n' +
        '  join question q on q.test = t.id\n';
    if(id === 'rand'){
        sql += 'group by t.id limit 1 order by random() < 0.01 limit 1';
        params = [];
    }else{
        sql += 'where t.id = $1 group by t.id';
    }
    db.query(sql, params, (err, res) => {
        if (err) {
            return error('Network Error');
        }
        let test = res.rows[0];
        success(test);
    });
}