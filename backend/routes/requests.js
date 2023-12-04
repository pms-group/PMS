const express = require('express');

// authentication functions
const requireClientAuth = require('../middleware/requireClientAuth');
const requireAdminAuth = require('../middleware/requireAdminAuth');
const requireSuperAuth = require('../middleware/requireSuperAuth');

// controller functions
const requestController = require('../controllers/requestController');

const router = express.Router();

// GET all requests for super admin
router.get('/',requireSuperAuth, requestController.getRequests);

// GET all requests for admin within own realestate
router.get('/realestate_requests',requireAdminAuth, requestController.getRealEstateRequests);

// GET all requests for client
router.get('/client_requests',requireClientAuth, requestController.getClientRequests);

// add a request for client. The id is the apartment's
router.post('/client_requests/:id', requireClientAuth, requestController.addClientRequest);

// UPDATE a request for client. The id is the request's
router.patch('/client_requests/:id', requireClientAuth, requestController.updateClientRequest);

// DELETE a request for client. The id is the request's
router.delete('/client_requests/:id', requireClientAuth, requestController.deleteClientRequest);

// respond for a request by admin. The id is the request's
router.patch('/realestate_requests/:id', requireAdminAuth, requestController.updateRealEstateRequest)

module.exports = router;