import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    console.log(req.body);
    res.statusCode = 201;
    res.json(true);
});

export default router;