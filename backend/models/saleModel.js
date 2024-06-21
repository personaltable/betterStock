import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "client",
        required: true,
    },
    information: {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true
        }
    },
    originalPrice: {
        type: Number,
        required: true,
    },

});

const Sales = mongoose.model("Sales", salesSchema);

export default Sales;