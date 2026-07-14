const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, updateUserStatus, getAnalytics } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/status', protect, admin, updateUserStatus);
router.get('/analytics', protect, admin, getAnalytics);

module.exports = router;
