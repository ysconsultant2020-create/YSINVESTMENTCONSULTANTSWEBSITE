const router = require('express').Router();
const ctrl = require('../controllers/customerController');
const { protect, managerOnly } = require('../middleware/auth');
const User = require('../models/User');
const Insurance = require('../models/Insurance');
const MutualFund = require('../models/MutualFund');
const SipPlan = require('../models/SipPlan');
const LumpsumPlan = require('../models/LumpsumPlan');
const Appointment = require('../models/Appointment');

router.get('/', protect, managerOnly, ctrl.getAll);
router.post('/seed', protect, managerOnly, ctrl.seedData);
router.get('/stats', protect, managerOnly, async (req, res, next) => {
  try {
    const [customers, insurance, mutualFunds, sipPlans, lumpsumPlans, appointments] = await Promise.all([
      User.countDocuments({ role: 'client' }),
      Insurance.countDocuments(),
      MutualFund.countDocuments(),
      SipPlan.countDocuments(),
      LumpsumPlan.countDocuments(),
      Appointment.countDocuments()
    ]);
    res.json({ customers, insurance, mutualFunds, sipPlans, lumpsumPlans, appointments });
  } catch (error) {
    next(error);
  }
});
router.get('/:id', protect, managerOnly, ctrl.getById);
router.put('/:id', protect, managerOnly, ctrl.update);
router.delete('/:id', protect, managerOnly, ctrl.remove);

module.exports = router;
