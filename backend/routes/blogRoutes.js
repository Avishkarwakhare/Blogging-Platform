const express = require('express');
const router = express.Router();
const {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
} = require('../controllers/blogController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Blog image upload route
router.post('/upload', protect, upload.single('coverImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a file' });
    }
    const filePath = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: filePath });
});

router
    .route('/')
    .get(optionalProtect, getBlogs)
    .post(protect, createBlog);

router
    .route('/:id')
    .get(optionalProtect, getBlogById)
    .put(protect, updateBlog)
    .delete(protect, deleteBlog);

module.exports = router;
