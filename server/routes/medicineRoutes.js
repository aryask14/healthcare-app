const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { validate, validateId } = require('../middleware/validate');
const { schemas } = require('../middleware/validate');

// Medicine Inventory
router.get('/', medicineController.getAllMedicines);
router.get('/search', medicineController.searchMedicines);
router.get('/:id', validateId, medicineController.getMedicineById);

// Restricted to Admin/Pharmacist
router.post(
  '/',
  verifyToken,
  checkRole(['admin', 'pharmacist']),
  validate(schemas.medicineCreate),
  medicineController.createMedicine
);

router.put(
  '/:id',
  verifyToken,
  checkRole(['admin', 'pharmacist']),
  validateId,
  medicineController.updateMedicine
);

router.delete(
  '/:id',
  verifyToken,
  checkRole(['admin']),
  validateId,
  medicineController.deleteMedicine
);

// Stock Management
router.patch(
  '/:id/stock',
  verifyToken,
  checkRole(['admin', 'pharmacist']),
  validateId,
  medicineController.updateStock
);

// Expiry Alerts
router.get(
  '/alerts/expiry',
  verifyToken,
  checkRole(['admin', 'pharmacist']),
  medicineController.getExpiringMedicines
);

module.exports = router;