import express from 'express';
import * as user from "./user/index";
import * as test from "./test/index";

const router = express.Router();

router.get('/', (req, res) => {
    test.GetList(req.query, rows => {
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
        test.Save(data, id => {
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

const answer = (req, res) => {
    let data = req.body;
    let answered = false;
    test.Answer(data, response => {
        if(answered) return;
        answered = true;
        res.statusCode = 200;
        return res.json({
            result: 'success',
            ...response
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
};

router.post('/answer', (req, res) => {
    let data = req.body;
    user.Auth(data, user => {
        data.user = user.id;
        answer(req, res);
    }, err => {
        answer(req, res);
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

router.delete('/:id', (req, res) => {
    let data = req.body;
    let answered = false;
    const token = req.headers['x-access-token'];
    if(!token){
        answered = true;
        res.statusCode = 200;
        return res.json({
            result: 'error',
            message: 'Invalid token'
        });
    }
    console.log(token);
    user.Auth(data, user => {
        console.log(user);
        test.Load(req.params.id, item => {
            console.log(item);
            if(item.user === user.id){
                test.Delete(item, () => {
                    answered = true;
                    res.statusCode = 200;
                    return res.json({
                        result: 'success'
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
            }else{
                if(answered) return;
                answered = true;
                res.statusCode = 200;
                return res.json({
                    result: 'error',
                    message: 'Invalid user'
                });
            }
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

export default router;