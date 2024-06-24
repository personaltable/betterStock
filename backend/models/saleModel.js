import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
    reference: {
        type: Number,
        required: true,
    },
    information: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});


const Sales = mongoose.model("Sales", salesSchema);

export default Sales;