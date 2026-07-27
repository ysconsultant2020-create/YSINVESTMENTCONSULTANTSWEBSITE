const ContactMessage = require('../models/ContactMessage');

// Create contact message (Public)
exports.create = async (req, res, next) => {
  try {
    const message = await ContactMessage.create(req.body);
    res.status(201).json({ message: 'Message sent successfully!', data: message });
  } catch (error) {
    next(error);
  }
};

// Get all messages (Manager)
exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await ContactMessage.countDocuments();
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      messages,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    next(error);
  }
};

// Mark as read
exports.markRead = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json(msg);
  } catch (error) {
    next(error);
  }
};

// Delete message
exports.remove = async (req, res, next) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};
