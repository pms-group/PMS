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

// add apartment
router.post('/', requireAdminAuth, apartmentController.addApartment);

// UPDATE apartment. The id is the apartment's
router.patch('/:id', requireAdminAuth, apartmentController.updateApartment);

// DELETE apartment. The id is the apartment's
router.delete('/:id', requireAdminAuth, apartmentController.deleteApartment) 


module.exports = router;