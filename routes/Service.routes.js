
const { createServices, getAllServices, deleteServices } = require('../controller/Service.controller');

const router = require('express').Router();

router.post('/createService',  createServices)
router.get('/get',   getAllServices)
router.delete('/delete/:id',deleteServices)

module.exports = router;
