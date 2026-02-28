const express = require('express');
const router = express.Router();
const {
    getAllEvents, getEventById,
    createEvent, updateEvent, deleteEvent,
} = require('../controllers/event.controller');
const upload = require('../middlewares/upload.middleware');

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', upload.single('poster'), createEvent);
router.put('/:id', upload.single('poster'), updateEvent);  // poster optional on update
router.delete('/:id', deleteEvent);

module.exports = router;
