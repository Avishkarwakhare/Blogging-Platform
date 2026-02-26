const Blog = require('../models/Blog');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get analytics overview
// @route   GET /api/analytics/overview
// @access  Private
const getOverview = async (req, res) => {
    try {
        const totalPosts = await Blog.countDocuments({ userId: req.user._id });
        const publishedPosts = await Blog.countDocuments({ userId: req.user._id, status: 'published' });
        const draftPosts = await Blog.countDocuments({ userId: req.user._id, status: 'draft' });

        const blogs = await Blog.find({ userId: req.user._id });
        const totalViews = blogs.reduce((acc, curr) => acc + curr.views, 0);

        res.json({
            success: true,
            stats: {
                totalPosts,
                publishedPosts,
                draftPosts,
                totalViews,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get views over time
// @route   GET /api/analytics/views-over-time
// @access  Private
const getViewsOverTime = async (req, res) => {
    try {
        const myBlogs = await Blog.find({ userId: req.user._id }).select('_id');
        const myBlogIds = myBlogs.map((b) => b._id);

        const logs = await ActivityLog.aggregate([
            {
                $match: {
                    action: 'viewed',
                    blogId: { $in: myBlogIds },
                    createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    views: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Create a map of existing data
        const logMap = logs.reduce((acc, curr) => {
            acc[curr._id] = curr.views;
            return acc;
        }, {});

        // Fill in missing dates for the last 30 days
        const fullData = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            fullData.push({
                _id: dateStr,
                views: logMap[dateStr] || 0
            });
        }

        res.json({ success: true, data: fullData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get top posts
// @route   GET /api/analytics/top-posts
// @access  Private
const getTopPosts = async (req, res) => {
    try {
        const topPosts = await Blog.find({ userId: req.user._id })
            .sort({ views: -1 })
            .limit(5)
            .select('title views');

        res.json({ success: true, data: topPosts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get category distribution
// @route   GET /api/analytics/category-distribution
// @access  Private
const getCategoryDistribution = async (req, res) => {
    try {
        const distribution = await Blog.aggregate([
            { $match: { userId: req.user._id } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);

        res.json({ success: true, data: distribution });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get recent activities
// @route   GET /api/activity
// @access  Private
const getActivity = async (req, res) => {
    try {
        const activities = await ActivityLog.find({ userId: req.user._id })
            .populate('blogId', 'title')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({ success: true, activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getOverview,
    getViewsOverTime,
    getTopPosts,
    getCategoryDistribution,
    getActivity,
};
