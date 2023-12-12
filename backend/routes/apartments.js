const express = require('express');

// authentication function
const requireAdminAuth = require('../middleware/requireAdminAuth');

// controller functions
const apartmentController = require('../controllers/apartmentController');

const router = express.Router();

// GET all apartments
router.get('/', apartmentController.getApartments);

// GET one realestates apartments. The id is the admin's
router.get('/realestate_apartments',requireAdminAuth, apartmentController.getAdminApartments);

// add apartment, image uploader is used in the controller
router.post('/', requireAdminAuth, apartmentController.addApartment);

// UPDATE apartment. The id is the apartment's, image uploader is used in the controller
router.patch('/:id', requireAdminAuth, apartmentController.updateApartment);

// DELETE apartment. The id is the apartment's
router.delete('/:id', requireAdminAuth, apartmentController.deleteApartment) 


module.exports = router;