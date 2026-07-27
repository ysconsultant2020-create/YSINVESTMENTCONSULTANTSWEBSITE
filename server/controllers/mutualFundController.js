const MutualFund = require('../models/MutualFund');
const fs = require('fs');
const path = require('path');

// Get all mutual funds
exports.getAll = async (req, res, next) => {
  try {
    const filter = req.user?.role === 'manager' ? {} : { isActive: true };
    const items = await MutualFund.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// Get single mutual fund
exports.getById = async (req, res, next) => {
  try {
    const item = await MutualFund.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Mutual fund not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Create mutual fund (Manager only)
exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = req.file.path || req.file.secure_url || `/uploads/${req.file.filename}`;
    }
    const item = await MutualFund.create(data);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// Update mutual fund (Manager only)
exports.update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = req.file.path || req.file.secure_url || `/uploads/${req.file.filename}`;
      const old = await MutualFund.findById(req.params.id);
      if (old && old.image && old.image.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', old.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }
    const item = await MutualFund.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ message: 'Mutual fund not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Delete mutual fund (Manager only)
exports.remove = async (req, res, next) => {
  try {
    const item = await MutualFund.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Mutual fund not found' });
    if (item.image && item.image.startsWith('/uploads/')) {
      const imgPath = path.join(__dirname, '..', item.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await MutualFund.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mutual fund deleted successfully' });
  } catch (error) {
    next(error);
  }
};
