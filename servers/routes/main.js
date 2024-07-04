const express = require('express');
const router = express.Router();
const Post = require('../models/post');

//get home
router.get("/", async (req, res) => {

    try {
        const locals = {
            title: "nodejs blog"
        };
        let perPage = 10;
        let page = parseInt(req.query.page) || 1; // Ensure page is an integer

        const Data = await Post.aggregate([
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
        ]);

        const count = await Post.countDocuments({});
        const nextPage = page + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            Data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error"); // Handle error gracefully
    }
});

//get post according to id

router.get("/post/:id", async (req, res) => {

    try {

        id = req.params.id;
        const Data = await Post.findById({ _id: id });
        res.render('post', {
            Data
        });

    }
    catch (error) {
        res.status(500).send(error.message);
    }
});


router.get("/about", (req, res) => {

    res.render('about');

});
/*
function insertPostData() {
    Post.insertMany([
        {
            title: "Building APIs with Node.js",
            body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
        },
        {
            title: "Deployment of Node.js applications",
            body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
        },
        {
            title: "Authentication and Authorization in Node.js",
            body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
        }
    ]);
};
*/
//insertPostData();
module.exports = router;
