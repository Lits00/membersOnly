const express = require('express');
const router = express.Router();

/* Controllers */
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

/* GET home page. */
router.get('/', userController.index);

/* User State */
router.get("/sign-up", userController.sign_up_get);
router.post("/sign-up", userController.sign_up_post);
router.get("/login", userController.login_get);
router.post("/login", userController.login_post);
router.get("/logout", userController.logout);

/* Membership route */
router.get("/membership", userController.set_membership_get);
router.post("/membership", userController.set_membership_post);

/* Admin route */
router.get("/admin-status", userController.set_admin_get);
router.post("/admin-status", userController.set_admin_post);

/* Posts route */
router.post("/new-post", postController.post_create_post)
router.get("/delete/:id", postController.post_delete_get);

/* About route */
router.get("/about", userController.about_get);

module.exports = router;