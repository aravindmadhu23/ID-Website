const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const workController = require('../controllers/workController');
const leaveController = require('../controllers/leaveController');
const announcementController = require('../controllers/announcementController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Auth Routes
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

// Work Entries & Dashboard
router.get('/dashboard/stats', authenticateToken, workController.getDashboardStats);
router.post('/work/submit', authenticateToken, workController.submitWorkEntry);

// Leave Requests
router.post('/leaves/request', authenticateToken, leaveController.requestLeave);
router.get('/leaves/my', authenticateToken, leaveController.getMyLeaves);

// Announcements
router.get('/announcements', authenticateToken, announcementController.getAllAnnouncements);
router.post('/announcements', authenticateToken, authorizeRoles('admin', 'manager'), announcementController.createAnnouncement);

module.exports = router;
