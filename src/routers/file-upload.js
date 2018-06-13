import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    let imageFile = req.files.file;
    imageFile.mv(`/var/www/testme/public/${req.body.name}`, function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.json({file: `public/${req.body.name}`});
    });
});

export default router;