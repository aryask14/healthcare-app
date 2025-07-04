const Medicine = require('../models/Medicine');
const asyncHandler = require('express-async-handler');
const { validateMedicineData } = require('../validations/medicineValidation');

// @desc    Create new medicine
// @route   POST /api/medicines
// @access  Private/Admin
const createMedicine = asyncHandler(async (req, res) => {
  const { error } = validateMedicineData(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const {
    name,
    genericName,
    manufacturer,
    dosageForm,
    strength,
    price,
    stock,
    expiryDate,
    prescriptionRequired
  } = req.body;

  const medicine = await Medicine.create({
    name,
    genericName,
    manufacturer,
    dosageForm,
    strength,
    price,
    stock,
    expiryDate: new Date(expiryDate),
    prescriptionRequired,
    addedBy: req.user._id
  });

  res.status(201).json({
    _id: medicine._id,
    name: medicine.name,
    genericName: medicine.genericName,
    price: medicine.price,
    stock: medicine.stock
  });
});

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Public
const getAllMedicines = asyncHandler(async (req, res) => {
  const { search, prescriptionRequired, inStock } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { genericName: { $regex: search, $options: 'i' } }
    ];
  }

  if (prescriptionRequired) {
    filter.prescriptionRequired = prescriptionRequired === 'true';
  }

  if (inStock === 'true') {
    filter.stock = { $gt: 0 };
  } else if (inStock === 'false') {
    filter.stock = { $lte: 0 };
  }

  const medicines = await Medicine.find(filter)
    .select('-__v')
    .sort({ name: 1 });

  res.json(medicines);
});

// @desc    Get medicine by ID
// @route   GET /api/medicines/:id
// @access  Public
const getMedicineById = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id)
    .populate('addedBy', 'name email')
    .select('-__v');

  if (!medicine) {
    res.status(404);
    throw new Error('Medicine not found');
  }

  res.json(medicine);
});

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Private/Admin
const updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error('Medicine not found');
  }

  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'name',
    'genericName',
    'manufacturer',
    'dosageForm',
    'strength',
    'price',
    'stock',
    'expiryDate',
    'prescriptionRequired'
  ];

  const isValidOperation = updates.every(update => 
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    res.status(400);
    throw new Error('Invalid updates!');
  }

  // Special handling for stock updates
  if (updates.includes('stock')) {
    const newStock = parseInt(req.body.stock);
    if (isNaN(newStock)) {
      res.status(400);
      throw new Error('Stock must be a number');
    }
    medicine.stock = newStock;
  }

  updates.forEach(update => {
    if (update !== 'stock') {
      medicine[update] = req.body[update];
    }
  });

  await medicine.save();
  res.json(medicine);
});

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
const deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error('Medicine not found');
  }

  // Prevent deletion if medicine is referenced in prescriptions
  const hasPrescriptions = await Prescription.exists({ 'medicines.medicine': medicine._id });
  if (hasPrescriptions) {
    res.status(400);
    throw new Error('Cannot delete - medicine is used in prescriptions');
  }

  await medicine.remove();
  res.json({ message: 'Medicine removed' });
});

// @desc    Update medicine stock
// @route   PATCH /api/medicines/:id/stock
// @access  Private/Admin
const updateStock = asyncHandler(async (req, res) => {
  const { action, quantity } = req.body;
  const medicine = await Medicine.findById(req.params.id);

  if (!medicine) {
    res.status(404);
    throw new Error('Medicine not found');
  }

  if (!['add', 'subtract'].includes(action)) {
    res.status(400);
    throw new Error('Invalid action. Use "add" or "subtract"');
  }

  const qty = parseInt(quantity);
  if (isNaN(qty)) {
    res.status(400);
    throw new Error('Quantity must be a number');
  }

  if (action === 'add') {
    medicine.stock += qty;
  } else {
    if (medicine.stock < qty) {
      res.status(400);
      throw new Error('Insufficient stock');
    }
    medicine.stock -= qty;
  }

  await medicine.save();
  res.json({ 
    _id: medicine._id,
    name: medicine.name,
    newStock: medicine.stock 
  });
});

module.exports = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  updateStock
};