const router = require('express').Router();
const ctrl = require('../controllers/mutualFundController');
const { protect, managerOnly, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', optionalAuth, ctrl.getAll);
router.get('/:id', optionalAuth, ctrl.getById);
router.post('/', protect, managerOnly, upload.single('image'), ctrl.create);
router.put('/:id', protect, managerOnly, upload.single('image'), ctrl.update);
router.delete('/:id', protect, managerOnly, ctrl.remove);

module.exports = router;
