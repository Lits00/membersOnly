const User = require('../models/userSchema');
const Post = require('../models/postSchema');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

/* Create Post */
exports.post_create_post = [
    body("title", "Title must not be empty and should not exceed 50 characters.")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),
    body("text", "text must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        try {
    
            const newPost = new Post({
                title: req.body.title,
                text:req.body.text,
                date: new Date(),
                user: req.user._id
            })

            if(!errors.isEmpty()) {
                res.render("error", {
                    title: "Error",
                    errors: errors.array(),
                })
            } else {
                await newPost.save();
                res.redirect("/");
            }

    
        } catch (err) {
            return next(err);
        };
    })
];

/* Delete Post */
exports.post_delete_get = asyncHandler(async (req, res, next) => {
    // console.log(req);
    await Post.findByIdAndDelete(req.params.id).exec();
    res.redirect("/");
});