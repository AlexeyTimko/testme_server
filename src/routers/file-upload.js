import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    console.log(req);
    res.statusCode = 201;
    res.json(req);
});

export default router;