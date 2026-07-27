const LumpsumPlan = require('../models/LumpsumPlan');
const fs = require('fs');
const path = require('path');

// Get all Lumpsum plans
exports.getAll = async (req, res, next) => {
  try {
    const filter = req.user?.role === 'manager' ? {} : { isActive: true };
    const items = await LumpsumPlan.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// Get single Lumpsum plan
exports.getById = async (req, res, next) => {
  try {
    const item = await LumpsumPlan.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Lumpsum plan not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Create Lumpsum plan (Manager only)
exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    const item = await LumpsumPlan.create(data);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// Update Lumpsum plan (Manager only)
exports.update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
      const old = await LumpsumPlan.findById(req.params.id);
      if (old && old.image) {
        const oldPath = path.join(__dirname, '..', old.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }
    const item = await LumpsumPlan.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ message: 'Lumpsum plan not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Delete Lumpsum plan (Manager only)
exports.remove = async (req, res, next) => {
  try {
    const item = await LumpsumPlan.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Lumpsum plan not found' });
    if (item.image) {
      const imgPath = path.join(__dirname, '..', item.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await LumpsumPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lumpsum plan deleted successfully' });
  } catch (error) {
    next(error);
  }
};
