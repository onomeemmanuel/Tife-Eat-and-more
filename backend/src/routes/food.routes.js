const express = require('express');
const router = express.Router();
const { getAllFoods, getFeatured } = require('../controllers/food.controller');

router.get('/', getAllFoods);
router.get('/featured', getFeatured);

module.exports = router;