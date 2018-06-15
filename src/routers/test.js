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
            error: err
        });
    });
});

router.post('/', (req, res) => {
    let data = req.body;
    if(!data.token){
        res.statusCode = 200;
        return res.json({
            result: 'error',
            error: 'Invalid token'
        });
    }
    user.Auth(data, user => {
        test.Add(data, id => {
            res.statusCode = 200;
            return res.json({
                result: 'success',
                id
            });
        }, err => {
            res.statusCode = 200;
            return res.json({
                result: 'error',
                error: err
            });
        });
    }, err => {
        res.statusCode = 200;
        return res.json({
            result: 'error',
            error: err
        });
    });
});

router.get('/:id', (req, res) => {});

router.patch('/:id', (req, res) => {});

router.delete('/:id', (req, res) => {});

export default router;