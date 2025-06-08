const { createFood, getallFood, deleteFood } = require('../controller/FoodGalle.controller');

const router = require('express').Router();

router.post('/create', createFood)
router.get('/getAll', getallFood);
router.delete('/delete/:id', deleteFood)
 


module.exports = router;
