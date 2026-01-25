const express = require('express');
const router = express.Router();
//models for DB
const Post = require('../models/Post');
const User = require('../models/User');

const adminLayout = '../views/layouts/admin';

/**
 * GET ROUTES
 */

//GET Admin - Log in
router.get('/admin', async(req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "this is the description"
        }
        res.render('admin/index', {locals, layout: adminLayout});
    } catch (error) {
        console.log(error);
    }
});


//post admin
router.post('/admin', async(req, res) => {
    try {
        const { username, password} = req.body;
        console.log(req.body);

        if(req.body.username === 'admin' && req.body.password === 'password'){
            res.send('You are logged in')
        } else{
            res.send('Wrong username or password');
        }

        res.redirect('/admin');
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;

// router.get('', async(req, res) => {
//     const locals = {
//         title: "NodeJS Blog",
//         description: "this is the description"
//     }

//     try {
//         const data = await Post.find();
//         res.render('index', {locals, data});
//     } catch (error) {
//         console.log(error);
//     }
// });