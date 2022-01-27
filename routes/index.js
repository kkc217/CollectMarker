const express= require('express');
const router = express.Router();

const init = require('./init');
const marker = require('./marker');

router.use('/', marker);
router.use('/marker', marker);

module.exports = router;