var express = require('express');
var router = express.Router();
const APIS = require('../api/index')

/* GET home page. */
router.post('/login', APIS.login);
module.exports = router;
