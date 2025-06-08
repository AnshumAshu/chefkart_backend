const { createGallery, getAllGallery, deleteGallery } = require('../controller/Gallery.controller');

const router = require('express').Router();

router.post('/createGallery',  createGallery)
router.get('/get',   getAllGallery)
router.delete('/delete',deleteGallery)

module.exports = router;