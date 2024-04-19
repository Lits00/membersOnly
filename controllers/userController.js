const User = require('../models/userSchema');
const Post = require('../models/postSchema');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const bcrypt = require('bcryptjs');

/* Home */
exports.index = asyncHandler(async (req, res, next) => {
    // get all post to display on homepage 
    const allPost = await Post.find({}).sort({ date: -1 }).populate("user").exec();
    res.render("index", {
        title: "Member's Club",
        posts: allPost,
    });
});

/* Sign up */
exports.sign_up_get = asyncHandler(async (req, res, next) => {
    res.render("signUp_form", {
        title: "Sign-Up",
        user: undefined,
        errors: [],
    })
});

exports.sign_up_post = [
    body("firstName", "First name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("lastName", "Last name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("username", "username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("password", "password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const userInput = bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if(err){
                // if err, do something
                return next(err);
            } else {
                // otherwise, store hashedPassword in DB
                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    password: hashedPassword,
                });

                if (!errors.isEmpty()) {
                    // re-render form with sanitized values/error messages 
                    res.render("signUp_form", {
                        title: "Sign-up",
                        user: user,
                        errors: errors.array(),
                    })
                } else {
                    await user.save();
                    res.redirect("/login");
                }
            }
        })
    }),
];

/* Log in */
exports.login_get = asyncHandler(async (req, res, next) => {
    res.render("login_form", {
        title: "Login",
    })
});

exports.login_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
});

/* Log out */
exports.logout = asyncHandler(async (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        res.redirect("/");
    })
});

/* Membership Access */
exports.set_membership_get = asyncHandler(async (req, res, next) => {
    res.render("access_form", { title: "Be a Member" })
});

exports.set_membership_post = asyncHandler(async (req, res, next) => {
    if(req.body.password === process.env.MEMBER_KEY) {
        const updatedUser = new User({
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            username: req.user.username,
            password: req.user.password,
            isMember: true,
            isAdmin: req.user.isAdmin,
            _id: req.user._id
        });
        await User.findByIdAndUpdate(req.user._id, updatedUser, {});
        res.redirect("/");
    } else {
        res.redirect("/membership");
    }
});

/* Admin Access */
exports.set_admin_get = asyncHandler(async (req, res, next) => {
    res.render("access_form", { title: "Be an Admin" })
});

exports.set_admin_post = asyncHandler(async (req, res, next) => {
    if(req.body.password === process.env.ADMIN_KEY) {
        const updatedUser = new User({
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            username: req.user.username,
            password: req.user.password,
            isMember: req.user.isMember,
            isAdmin: true,
            _id: req.user._id
        });
        await User.findByIdAndUpdate(req.user._id, updatedUser, {});
        res.redirect("/");
    } else {
        res.redirect("/admin-status");
    }
});

exports.about_get = asyncHandler(async (req, res, next) => {
    res.render("about", { title: "About", });
})