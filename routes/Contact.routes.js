const express = require('express');
const { createContact, getallContact } = require('../controller/Contact.controller');

const router = express.Router();

router.post('/createContact', createContact);
router.get('/get', getallContact);

module.exports = router;
