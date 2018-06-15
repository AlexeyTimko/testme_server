import express from 'express';

const router = express.Router();
const toHex = str => {
    let result = '';
    for (let i=0; i<str.length; i++) {
        result += str.charCodeAt(i).toString(16);
    }
    return result;
};
router.post('/', (req, res) => {
    let imageFile = req.files.file;
    let nameParts = req.body.name.split('.');
    const ext = nameParts[nameParts.length - 1];
    const name = toHex(`${(new Date()).getTime()}${Math.round(Math.random()*100)}`);
    const fn = `${name}.${ext}`;
    const fnp = `/var/www/testme/build/img/${fn}`;
    imageFile.mv(fnp, function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.json({file: fn});
    });
});

export default router;