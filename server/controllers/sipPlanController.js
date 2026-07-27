const SipPlan = require('../models/SipPlan');
const fs = require('fs');
const path = require('path');

// Get all SIP plans
exports.getAll = async (req, res, next) => {
  try {
    const filter = req.user?.role === 'manager' ? {} : { isActive: true };
    const items = await SipPlan.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// Get single SIP plan
exports.getById = async (req, res, next) => {
  try {
    const item = await SipPlan.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'SIP plan not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Create SIP plan (Manager only)
exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    const item = await SipPlan.create(data);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// Update SIP plan (Manager only)
exports.update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
      const old = await SipPlan.findById(req.params.id);
      if (old && old.image) {
        const oldPath = path.join(__dirname, '..', old.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }
    const item = await SipPlan.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ message: 'SIP plan not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Delete SIP plan (Manager only)
exports.remove = async (req, res, next) => {
  try {
    const item = await SipPlan.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'SIP plan not found' });
    if (item.image) {
      const imgPath = path.join(__dirname, '..', item.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await SipPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'SIP plan deleted successfully' });
  } catch (error) {
    next(error);
  }
};
