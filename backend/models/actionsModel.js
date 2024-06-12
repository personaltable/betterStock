import mongoose from 'mongoose';

const actionsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    product: { type: String, required: true },
    changes: {
        original: { type: mongoose.Schema.Types.Mixed },
        modified: { type: mongoose.Schema.Types.Mixed },
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
});

const Actions = mongoose.model('Actions', actionsSchema);

export default Actions;