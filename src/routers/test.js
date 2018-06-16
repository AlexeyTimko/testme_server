import express from 'express';
import * as user from "./user/index";
import * as test from "./test/index";

const router = express.Router();

router.get('/', (req, res) => {
    test.GetList({}, rows => {
        res.statusCode = 200;
        res.json(rows);
    }, err => {
        res.statusCode = 200;
        return res.json({
            result: 'error',
            message: err
        });
    });
});

router.post('/', (req, res) => {
    let data = req.body;
    let answered = false;
    if(!data.token){
        answered = true;
        res.statusCode = 200;
        return res.json({
            result: 'error',
            message: 'Invalid token'
        });
    }
    user.Auth(data, user => {
        data.user = user.id;
        test.Add(data, id => {
            if(answered) return;
            answered = true;
            res.statusCode = 200;
            return res.json({
                result: 'success',
                id
            });
        }, err => {
            if(answered) return;
            answered = true;
            res.statusCode = 200;
            return res.json({
                result: 'error',
                message: err
            });
        });
    }, err => {
        if(answered) return;
        answered = true;
        res.statusCode = 200;
        return res.json({
            result: 'error',
            message: err
        });
    });
});

router.get('/:id', (req, res) => {
    test.Load(req.params.id, item => {
        res.statusCode = 200;
        res.json(item);
    }, err => {
        res.statusCode = 200;
        return res.json({
            result: 'error',
            message: err
        });
    });
});

router.patch('/:id', (req, res) => {});

router.delete('/:id', (req, res) => {});

export default router;