const mongoose = require('mongoose');

const blogSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        content: { type: String, required: true },
        excerpt: { type: String },
        category: {
            type: String,
            required: true,
            enum: ['Technology', 'Lifestyle', 'Education', 'Health', 'Finance', 'Other'],
            default: 'Other',
        },
        tags: [String],
        status: {
            type: String,
            required: true,
            enum: ['draft', 'published'],
            default: 'draft',
        },
        coverImage: { type: String },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Middleware to generate slug before validation
blogSchema.pre('validate', function (next) {
    if (this.title && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
