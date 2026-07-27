const Appointment = require('../models/Appointment');
const { sendManagerNotification, sendClientConfirmation } = require('../utils/sendEmail');

// Create appointment (Client)
exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.user && req.user._id !== 'manager') {
      data.customer = req.user._id;
    }

    const appointment = await Appointment.create(data);

    // Send emails (non-blocking)
    sendManagerNotification(data).catch(console.error);
    sendClientConfirmation(data).catch(console.error);

    res.status(201).json({
      message: 'Appointment booked successfully!',
      appointment
    });
  } catch (error) {
    next(error);
  }
};

// Get all appointments (Manager)
exports.getAll = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Appointment.countDocuments(filter);
    const appointments = await Appointment.find(filter)
      .populate('customer', 'name email phone city')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      appointments,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    next(error);
  }
};

// Get client's own appointments
exports.getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ customer: req.user._id })
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// Update appointment status (Manager)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

// Delete appointment (Manager)
exports.remove = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
