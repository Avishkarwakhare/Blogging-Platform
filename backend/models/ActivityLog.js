const mongoose = require('mongoose');

const activityLogSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
        action: {
            type: String,
            required: true,
            enum: ['created', 'updated', 'deleted', 'published', 'viewed'],
        },
        metadata: { type: Object },
    },
    { timestamps: true }
);

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
module.exports = ActivityLog;
