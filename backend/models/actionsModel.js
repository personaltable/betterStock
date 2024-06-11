import mongoose from 'mongoose';

const actionsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
});

const Actions = mongoose.model('Actions', actionsSchema);

export default Actions;