import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import Category from '../models/categoryModel.js'

//@desc     Get all products
//route     GET /api/products/
//@access   Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find()
        .populate('category', 'name')
        .populate('createdBy', 'name');

    res.status(200).json(products);
});

//@desc     Create new product
//route     POST /api/products/
//@access   Public
const createProduct = asyncHandler(async (req, res) => {
    const { name, categoryName, brand, information, price, createdBy, reStock, lowStock, stock } = req.body;

    const category = await Category.findOne({ name: categoryName });
    if (!category) {
        return res.status(400).json({ message: "Category not found" });
    }

    const product = new Product({
        name,
        category: category._id,
        brand,
        information,
        price,
        createdBy,
        reStock,
        lowStock,
        stock
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
});


//@desc     Get all categories
//route     GET /api/products/categories
//@access   Public
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find()

    res.status(200).json(categories);
});

export { getProducts, createProduct, getCategories };