const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin'; // Ensure this path is correct
const jwtSecret = process.env.JWT_SECRET;

/**
 * 
 * Check Login
*/
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}



// Get admin login page
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// post admin check login
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            res.status(401).json({ message: "invalid credentials" });
        }

        const pass = await bcrypt.compare(password, user.password);
        if (!pass) {
            res.status(401).json({ message: "invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');


    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

//get admin dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        res.render('admin/dashboard');

    } catch (error) {
        res.send("server crashed");
    }
});



//post admin-register
router.post('/register', async (req, res) => {

    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: "user created", user });
        } catch (error) {
            if (error === 11000) {
                res.status(401).json({ message: "user already created" });
            }
            res.status(500).json({ message: "server error" });

        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


module.exports = router;


