const router = require('express').Router();
const ctrl = require('../controllers/sipPlanController');
const { protect, managerOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, ctrl.getAll);
router.get('/:id', protect, ctrl.getById);
router.post('/', protect, managerOnly, upload.single('image'), ctrl.create);
router.put('/:id', protect, managerOnly, upload.single('image'), ctrl.update);
router.delete('/:id', protect, managerOnly, ctrl.remove);

module.exports = router;
