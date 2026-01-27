const express = require('express');
const router = express.Router();
//models for DB
const Post = require('../models/Post');
const User = require('../models/User');
//for encrypting and decrypting pw
const bcrypt = require('bcrypt');
//cookies
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const adminLayout = '../views/layouts/admin';

/**
 * CHECK
 * LOGIN
 */

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({ message: 'Unauthorised'});
    }

    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(error){
        return res.status(401).json({ message: 'Unauthorised'});
    }
}

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
        res.render('admin/index', {
            locals, 
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }
});

//GET Admin Dashboard
router.get('/dashboard', authMiddleware, async(req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'Blog Dashboard'
        }
        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout:adminLayout,
        });
    } catch (error) {
        console.log(error);
    }
});

//GET Admin add new post page  
router.get('/add-post', authMiddleware, async(req, res) => {
    

    try {
        const locals = {
            title: "Add New Post",
            description: "this is the description"
        }
        const data = await Post.find();
        res.render('admin/add-post', {
            locals, 
            data, 
            layout:adminLayout
        });
    } catch (error) {
        console.log(error);
    }
});

/**
 * POST ROUTES
 */

//POST Admin Log In
router.post('/admin', async(req, res) => {
    try {
        const { username, password} = req.body;
        
        const user = await User.findOne({ username});
        if(!user){
            return res.status(401).json({message: 'Invalid credentials!'});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message: 'Invalid credentials!'});
        }

        //save token
        const token = jwt.sign({userId: user.id}, jwtSecret);
        res.cookie('token', token, {httpOnly:true});

        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
});

//POST Admin Register 
router.post('/register', async(req, res) => {
    try {
        const { username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password:hashedPassword}); //from user model we inserted at the top 
            res.status(201).json({ message: 'User Created!', user});
        } catch (error) {
            if(error.code === 11000){
                res.status(409).json({message: 'User already in use'}); 
            }
            res.status(500).json({message:'Internal Server Error'});
        }


    } catch (error) {
        console.log(error);
    }
});

//POST Admin add a new post 
router.post('/add-post', authMiddleware, async(req, res) => {
    try {
        try{
            const newPost = new Post({
                title:req.body.title,
                body:req.body.body
            });

            await Post.create(newPost); 
            res.redirect('/dashboard');
        } catch(error){
            console.log(error)
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;

//GET TEMPLATE
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

//POST TEMPLATE
// router.post('/admin', async(req, res) => {
//     try {
//         const { username, password} = req.body;
//         console.log(req.body);

//         if(req.body.username === 'admin' && req.body.password === 'password'){
//             res.send('You are logged in')
//         } else{
//             res.send('Wrong username or password');
//         }

//         res.redirect('/admin');
//     } catch (error) {
//         console.log(error);
//     }
// });