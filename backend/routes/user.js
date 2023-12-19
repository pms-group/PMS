const express = require('express');

// authentication functions
const requireSuperAuth = require('../middleware/requireSuperAuth');
const requireAuth = require('../middleware/requireAuth')

// controller functions
const userController = require('../controllers/userController');

const router = express.Router();

// login route
router.post('/login', userController.loginUser);

// client signup route
router.post('/client_signup', userController.signupClient);

// UPDATE profile route, image uploader is used in the controller
router.patch('/update_profile', requireAuth, userController.updateProfile);

// admin signup route
router.post('/admin_signup',requireSuperAuth, userController.signupAdmin);

// admin DELETE route
router.delete('/remove_realestate/:id', requireSuperAuth, userController.deleteAdmin);

// GET all admin route
router.get('/view_realestates', userController.getAdmins)

module.exports = router