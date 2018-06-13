import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    let imageFile = req.files.file;
    const fn = `${(new Date()).getTime()}${req.body.name}`;
    const fnp = `/var/www/testme/build/img/${fn}`;
    imageFile.mv(fnp, function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.json({file: fn});
    });
});

export default router;