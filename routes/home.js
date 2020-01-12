const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
    res.render('index', {title: 'MedReg', message: 'Hello MedReg Team'});
});

module.exports = router;