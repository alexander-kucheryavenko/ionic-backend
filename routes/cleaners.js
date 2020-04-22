const express = require('express');

const controller = require('../controllers/cleaners');

const router = express.Router();

// localhost:8000/cleaners/create
router.post('/create', controller.create);
// localhost:8000/cleaners/gallery
router.post('/gallery', controller.gallery);



module.exports = router;
