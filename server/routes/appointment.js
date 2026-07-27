const router = require('express').Router();
const ctrl = require('../controllers/appointmentController');
const { protect, managerOnly } = require('../middleware/auth');

// Client
router.post('/', protect, ctrl.create);
router.get('/my', protect, ctrl.getMyAppointments);

// Manager
router.get('/', protect, managerOnly, ctrl.getAll);
router.put('/:id/status', protect, managerOnly, ctrl.updateStatus);
router.delete('/:id', protect, managerOnly, ctrl.remove);

module.exports = router;
