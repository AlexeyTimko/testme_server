import db from './db';

export default function() {
    this.fields = {
        name: '',
        description: '',
        isPrivate: false,
        isLimited: false,
        timeLimit: 0
    };
    this.data = {};
    this.errors = [];
    this.getData = () => this.data;
    this.setData = data => {
        for(let field in this.fields){
            if(!this.fields.hasOwnProperty(field)){
                continue;
            }
            if(data.hasOwnProperty(field)){{
                this.data[field] = data[field].value;
            }}
        }
        return this;
    };
    this.validate = () => {
        return true;
    };
    this.getList = (params, callback) => {
        const sql = 'SELECT * FROM test ORDER BY id DESC';
        db.query(sql, (err, res) => {
            if (err) {
                return this.errors.push('Could not retrieve test after create');
            }
            callback(res);
        });
    };
    this.save = (callback) => {
        if(!this.validate()){
            this.errors.push('Invalid data');
            return;
        }
        const sql = 'INSERT INTO test (name, description, isPrivate, isLimited, timeLimit) VALUES ($1,$2,$3,$4,$5) RETURNING id';
        const data = [
            this.data.name,
            this.data.description,
            this.data.isPrivate,
            this.data.isLimited,
            this.data.timeLimit
        ];
        db.query(sql, data, (err, res) => {
            if (err) {
                return this.errors.push('Could not save test');
            }
            const id = res.rows[0].id;
            const sql = 'SELECT * FROM test WHERE id = $1';
            db.query(sql, [ id ], (err, res) => {
                if (err) {
                    return this.errors.push('Could not retrieve test after create');
                }
                this.data.id = id;
                callback();
            });
        })
    };
};