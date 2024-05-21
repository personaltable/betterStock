import mongoose from 'mongoose';

// Definição do esquema para os produtos
const produtoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String },
    information: { type: String},
    price: { type: Number},
    creationDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reStock: { type: String, default: '' },
    lowStock:{ type: Number, default: 0 },
    stock: { type: Number, default: 0 }
});

// Criação do modelo para a coleção de produtos
const Product = mongoose.model('Product', produtoSchema);

export default Product;