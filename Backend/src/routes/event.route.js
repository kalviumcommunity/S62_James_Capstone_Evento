const express = require('express')
const router = express.Router();
const {getAllEvents,createEvent} = require('../controllers/event.controller')

router.get('/',getAllEvents);

router.post('/',createEvent)

module.exports = router;