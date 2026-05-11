const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createClaim,
  getClaims,
  getClaim,
  updateClaimStatus,
  deleteClaim
} = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images and documents are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.route('/')
  .get(protect, getClaims)
  .post(protect, upload.array('documents', 5), createClaim);

router.route('/:id')
  .get(protect, getClaim)
  .delete(protect, deleteClaim);

router.put('/:id/status', protect, authorize('admin'), updateClaimStatus);

module.exports = router;
