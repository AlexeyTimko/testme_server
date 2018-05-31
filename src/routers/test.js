import express from 'express';
import TestModel from '../models/test';

let testList = [];


const router = express.Router();

router.get('/', (req, res) => {
    res.statusCode = 200;
    res.json(testList);
});

router.post('/', (req, res) => {
    let newTest = new TestModel();
    newTest.setData(req.body);
    newTest.save();
    console.log('Finished');
    if(newTest.errors.length > 0){
        res.statusCode = 500;
        res.json(newTest.errors);
    }else{
        testList.push(newTest.getData());
        res.statusCode = 201;
        res.json(newTest.getData());
    }
});

router.get('/:id', (req, res) => {});

router.patch('/:id', (req, res) => {});

router.delete('/:id', (req, res) => {});

export default router;