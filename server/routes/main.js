const express = require('express');
const router = express.Router();

//routes 
router.get('', (req, res) => {
    const locals = {
        title: "Yap Blog",
        description: "Simple blog created with NodeJS & Express"
    }
    res.render('index', { locals });
});

router.get('/about', (req, res) => {
    res.render('about');
});

module.exports = router;
