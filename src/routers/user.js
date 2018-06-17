import express from 'express';
import * as user from "./user/index";
import jwt from 'jsonwebtoken';
import config from '../config';

const router = express.Router();

router.get('/', (req, res) => {
    res.statusCode = 200;
    res.json([]);
});

router.post('/', (req, res) => {
    user.Registration(req.body, id => {
        res.statusCode = 201;
        res.json({
            result: 'success',
            id
        });
    }, err => {
        res.statusCode = 200;
        return res.json({
            result: 'error',
            message: err
        });
    });
});

router.post('/auth/', (req, res) => {
    user.Auth(req.body, user => {
        const token = jwt.sign({ user }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.statusCode = 200;
        res.json({
            result: 'success',
            user: {
                id: user.id,
                email: user.email,
                token
            }
        });
    }, err => {
        res.statusCode = 200;
        return res.json({
            result: 'error',
            message: err
        });
    });
});

router.get('/:id', (req, res) => {});

router.patch('/:id', (req, res) => {});

router.delete('/:id', (req, res) => {});

export default router;