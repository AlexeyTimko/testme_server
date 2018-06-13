import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    let imageFile = req.files.file;
    res.json({file: `${__dirname}/../../public/${req.body.filename}.jpg`});
    // imageFile.mv(`${__dirname}/../../public/${req.body.filename}.jpg`, function(err) {
    //     if (err) {
    //         return res.status(500).send(err);
    //     }
    //
    //     res.json({file: `public/${req.body.filename}.jpg`});
    // });
});

export default router;