const express = require('express')
const router = express.Router();
const {getAllEvents,createEvent,updateEvent} = require('../controllers/event.controller')

router.get('/',getAllEvents);

router.post('/',createEvent)

router.put('/:id',updateEvent)

module.exports = router;