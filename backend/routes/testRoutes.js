const express = require('express');
const router = express.Router();
const {
  getTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest
} = require('../controllers/testController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTests)
  .post(protect, authorize('Admin'), createTest);

router.route('/:id')
  .get(getTestById)
  .put(protect, authorize('Admin'), updateTest)
  .delete(protect, authorize('Admin'), deleteTest);

module.exports = router;
