const express = require('express');

// authentication function
const requireAdminAuth = require('../middleware/requireAdminAuth');

// controller functions
const apartmentController = require('../controllers/apartmentController');

const router = express.Router();

// GET all apartments
router.get('/', apartmentController.getApartments);

// add apartment
router.post('/', requireAdminAuth, apartmentController.addApartment);

// UPDATE apartment
router.patch('/:id', requireAdminAuth, apartmentController.updateApartment);


module.exports = router;