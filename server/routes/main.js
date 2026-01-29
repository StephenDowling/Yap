const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * GET ROUTES
 */
//GET Home Page
router.get('', async (req, res) => {
    try{
        const locals = {
            title: "Yap Blog",
            description: "Simple blog created with NodeJS & Express"
        }
        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{$sort: {createdAt: -1 }}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);
        
        
        res.render('index', { 
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage: null,
            currentRoute: '/'
         });

    } catch(error){
        console.log(error)
    }
    
});

//GET Post :id

router.get('/post/:id', async(req, res) => {
    try {
        

        let slug = req.params.id;

        const data = await Post.findById({ _id: slug});

        const locals = {
            title: data.title,
            description: "Simple blog created with NodeJS & Express",
            currentRoute: `/post/${slug}`
        };

        res.render('post', {locals, data, currentRoute});

    } catch (error) {
        console.log(error);
    }
    
    


})

//GET About Page
router.get('/about', (req, res) => {
    res.render('about',{
        currentRoute: '/about'
    });
});

/**
 * POST ROUTES
 */

//POST searchTerm
router.post('/search', async(req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "searching searching searching for love"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const data = await Post.find({
            $or: [
                //regexs for removing special characters 
                {title: { $regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body: { $regex: new RegExp(searchNoSpecialChar, 'i')}}
            ]
        });
        res.render("search", {
            data,
            locals
        });
    } catch (error) {
        console.log(error);
    }

})

//POST Insert Data
// function insertPostData() {
//     Post.insertMany([
//         {
//             title: "Building a Blog",
//             body: "This is the body text"
//         },
//         {
//             title: "Programming with NodeJs",
//             body: "This is the body text"
//         },
//         {
//             title: "Connecting a database",
//             body: "This is the body text"
//         },
//         {
//             title: "Petting your cat",
//             body: "This is the body text"
//         }
//     ])
// };

// insertPostData();

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