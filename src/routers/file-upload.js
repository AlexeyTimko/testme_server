import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    let imageFile = req.files.file;
    const fn = `/var/www/testme/build/img/${new Date()}${req.body.name}`;
    imageFile.mv(fn, function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.json({file: fn});
    });
});

export default router;