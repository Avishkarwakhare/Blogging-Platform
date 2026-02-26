const express = require('express');
const router = express.Router();
const {
    getOverview,
    getViewsOverTime,
    getTopPosts,
    getCategoryDistribution,
    getActivity,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/overview', protect, getOverview);
router.get('/views-over-time', protect, getViewsOverTime);
router.get('/top-posts', protect, getTopPosts);
router.get('/category-distribution', protect, getCategoryDistribution);
router.get('/activity', protect, getActivity);

module.exports = router;
