const express = require('express');

// authentication functions
const requireClientAuth = require('../middleware/requireClientAuth');
const requireAdminAuth = require('../middleware/requireAdminAuth');
const requireSuperAuth = require('../middleware/requireSuperAuth');

// controller functions
const userController = require('../controllers/userController');

const router = express.Router();

// login route
router.post('/login', userController.loginUser);

// client signup route
router.post('/client_signup', userController.signupClient);

// client UPDATE route
router.patch('/update_client/:id', requireClientAuth, userController.updateClient);

// superadmin UPDATE route
router.patch('/update_superadmin/:id', requireSuperAuth, userController.updateSuper);

// admin signup route
router.post('/admin_signup',requireSuperAuth, userController.signupAdmin);

// admin DELETE route
router.delete('/remove_admin/:id', requireSuperAuth, userController.deleteAdmin);

// GET all admin route
router.get('/view_admins', userController.getAdmins)

// admin UPDATE route
router.patch('/update_admin/:id', requireAdminAuth, userController.updateAdmin);


module.exports = router