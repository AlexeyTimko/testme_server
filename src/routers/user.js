import express from 'express';
import * as user from "./user/index";

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
            error: err
        });
    });
});

router.post('/auth/', (req, res) => {
    res.statusCode = 201;
    res.json(req.body);
});

router.get('/:id', (req, res) => {});

router.patch('/:id', (req, res) => {});

router.delete('/:id', (req, res) => {});

export default router;