const Insurance = require('../models/Insurance');
const fs = require('fs');
const path = require('path');

// Get all insurance (client: active only, manager: all)
exports.getAll = async (req, res, next) => {
  try {
    const filter = req.user?.role === 'manager' ? {} : { isActive: true };
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const items = await Insurance.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// Get single insurance
exports.getById = async (req, res, next) => {
  try {
    const item = await Insurance.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Insurance not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Create insurance (Manager only)
exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    const item = await Insurance.create(data);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// Update insurance (Manager only)
exports.update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
      // Delete old image
      const old = await Insurance.findById(req.params.id);
      if (old && old.image) {
        const oldPath = path.join(__dirname, '..', old.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }
    const item = await Insurance.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ message: 'Insurance not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Delete insurance (Manager only)
exports.remove = async (req, res, next) => {
  try {
    const item = await Insurance.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Insurance not found' });
    // Delete image file
    if (item.image) {
      const imgPath = path.join(__dirname, '..', item.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await Insurance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Insurance deleted successfully' });
  } catch (error) {
    next(error);
  }
};
