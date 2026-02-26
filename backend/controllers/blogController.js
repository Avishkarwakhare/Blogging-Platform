const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
    const { search, category, status, sort } = req.query;

    const query = {};

    // 1. Mandatory Status & Security Filter
    if (status === 'all' || status === 'draft' || status === 'published') {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Please login to view these stories.' });
        }

        if (status === 'all') {
            // No specific status filter means all posts for this user
        } else {
            query.status = status;
        }
        query.userId = new mongoose.Types.ObjectId(req.user._id);
    } else {
        // Public discovery only shows published posts from ALL users
        query.status = 'published';
    }

    // 2. Secondary Filters
    if (category) {
        query.category = category;
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } },
        ];
    }

    // 3. Sorting
    let sortQuery = { createdAt: -1 };
    if (sort === 'views') sortQuery = { views: -1 };
    if (sort === 'oldest') sortQuery = { createdAt: 1 };

    try {
        const blogs = await Blog.find(query).populate('userId', 'name').sort(sortQuery);
        res.json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('userId', 'name bio avatar');

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        // Security check for draft access
        if (blog.status === 'draft') {
            const currentUserId = req.user?._id?.toString();
            const authorId = blog.userId?._id?.toString() || blog.userId?.toString();

            if (currentUserId !== authorId) {
                return res.status(403).json({ success: false, message: 'Not authorized to view this draft' });
            }
        }

        // Deduplicate views (e.g. from React StrictMode or accidental refreshes)
        // Check if there was a view for this blog in the last 10 seconds
        const recentView = await ActivityLog.findOne({
            blogId: blog._id,
            action: 'viewed',
            createdAt: { $gte: new Date(Date.now() - 10 * 1000) }
        });

        // Authors viewing their own posts shouldn't increase view count
        const currentUserId = req.user?._id?.toString();
        const authorId = blog.userId?._id?.toString() || blog.userId?.toString();
        const isAuthor = currentUserId === authorId;

        if (!recentView && !isAuthor) {
            // Increment view count
            blog.views += 1;
            await blog.save();

            // Log view activity
            await ActivityLog.create({
                userId: req.user?._id, // Add userId if available
                blogId: blog._id,
                action: 'viewed',
            });
        }

        res.json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
    const { title, content, category, tags, status, coverImage } = req.body;

    try {
        const blog = new Blog({
            userId: req.user._id,
            title,
            content,
            category,
            tags,
            status,
            coverImage,
        });

        const createdBlog = await blog.save();

        await ActivityLog.create({
            userId: req.user._id,
            blogId: createdBlog._id,
            action: 'created',
        });

        res.status(201).json({ success: true, blog: createdBlog });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = async (req, res) => {
    const { title, content, category, tags, status, coverImage } = req.body;

    try {
        const blog = await Blog.findById(req.params.id);

        if (blog) {
            if (blog.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ success: false, message: 'Not authorized' });
            }

            blog.title = title || blog.title;
            blog.content = content || blog.content;
            blog.category = category || blog.category;
            blog.tags = tags || blog.tags;
            blog.status = status || blog.status;
            blog.coverImage = coverImage || blog.coverImage;

            const updatedBlog = await blog.save();

            await ActivityLog.create({
                userId: req.user._id,
                blogId: updatedBlog._id,
                action: 'updated',
            });

            res.json({ success: true, blog: updatedBlog });
        } else {
            res.status(404).json({ success: false, message: 'Blog not found' });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (blog) {
            if (blog.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ success: false, message: 'Not authorized' });
            }

            await blog.deleteOne();

            await ActivityLog.create({
                userId: req.user._id,
                blogId: req.params.id,
                action: 'deleted',
            });

            res.json({ success: true, message: 'Blog removed' });
        } else {
            res.status(404).json({ success: false, message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
};
