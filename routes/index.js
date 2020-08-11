const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controllers');
console.log("Router is loaded");

router.get('/', homeController.home);
router.post('/submit-code', homeController.submitCode);
module.exports = router;