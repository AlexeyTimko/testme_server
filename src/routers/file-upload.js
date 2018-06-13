import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    let imageFile = req.files.file;
    imageFile.mv(`${__dirname}/../../../public/${req.body.fileame}.jpg`, function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.json({file: `public/${req.body.name}.jpg`});
    });
});

export default router;