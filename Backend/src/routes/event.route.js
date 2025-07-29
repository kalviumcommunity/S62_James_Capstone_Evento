// const express = require('express')
// const router = express.Router();
// const {getAllEvents,createEvent,updateEvent} = require('../controllers/event.controller')

// router.get('/',getAllEvents);

// router.post('/',createEvent)

// router.put('/:id',updateEvent)

// module.exports = router;

const express = require('express');
const router = express.Router();
const { getAllEvents, createEvent, updateEvent } = require('../controllers/event.controller');
const upload = require('../middlewares/upload.middleware'); // multer
// const verifyToken = require('../middlewares/auth.middleware'); // optional auth

router.get('/', getAllEvents);

// If authentication is required, use verifyToken as middleware
router.post('/', upload.single('poster'), createEvent);

router.put('/:id', updateEvent);

module.exports = router;

