const router = require('express').Router();
const ctrl = require('../controllers/contactController');
const { protect, managerOnly } = require('../middleware/auth');

router.post('/', ctrl.create);
router.get('/', protect, managerOnly, ctrl.getAll);
router.put('/:id/read', protect, managerOnly, ctrl.markRead);
router.delete('/:id', protect, managerOnly, ctrl.remove);

module.exports = router;
