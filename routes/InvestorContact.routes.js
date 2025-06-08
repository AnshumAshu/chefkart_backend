const { getallInvestorContact, createInvestContact } = require('../controller/InvestorContact.controller');

const router = require('express').Router();

router.post('/create', createInvestContact)
router.get('/getinvestorContact', getallInvestorContact);


module.exports = router;