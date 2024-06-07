import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import { check, validationResult } from "express-validator";

//@desc     Get all products
//route     GET /api/products/
//@access   Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("category", "name")
    .populate("createdBy", "name");

  res.status(200).json(products);
});

//@desc     Create new product
//route     POST /api/products/
//@access   Public
const createProduct = asyncHandler(async (req, res) => {
  // Validações
  await check("name", "O nome é obrigatório").not().isEmpty().run(req);
  await check("category", "A categoria é obrigatória").not().isEmpty().run(req);
  await check("stock", "O Stock deve ser numérico").isNumeric().run(req);
  await check("stock", "O Stock não deve passar de 5 dígitos")
    .isLength({ max: 5 })
    .run(req);
  await check("information", "A informação só pode conter 30 palavras")
    .custom((value) => {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > 30) {
        throw new Error("A informação só pode conter 30 palavras");
      }
      return true;
    })
    .run(req);

  // Verifica erros de validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    category,
    brand,
    information,
    price,
    createdBy,
    reStock,
    lowStock,
    stock,
  } = req.body;

  const categoryName = await Category.findOne({ name: category });
  if (!categoryName) {
    return res.status(400).json({ message: "Category not found" });
  }

  const userName = await User.findOne({ name: createdBy });
  if (!userName) {
    return res.status(400).json({ message: "User not found" });
  }

  const product = new Product({
    name,
    category: categoryName._id,
    brand,
    information,
    price,
    createdBy: userName._id,
    reStock,
    lowStock,
    stock,
  });

  const savedProduct = await product.save();

  res.status(201).json(savedProduct);
});

//@desc     Excluir produto
//route     DELETE /api/products/
//@access   Público

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    // Extrair os IDs dos produtos a serem excluídos da lista de produtos recebida
    const productIds = req.body.map((productId) =>
      mongoose.Types.ObjectId(productId)
    );
    console.log(productIds);

    // Use o método deleteMany do modelo de Produto para excluir vários produtos
    const result = await Product.deleteMany({ _id: { $in: productIds } });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Produtos excluídos com sucesso." });
    } else {
      res
        .status(404)
        .json({ message: "Nenhum produto encontrado para exclusão." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Não foi possível excluir os produtos." });
  }
});

//@desc     Change Stock
//route     PUT /api/products/store
//@access   Public
const changeStock = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).send({ message: "Produto não encontrado" });
    }
    res.send(product);
  } catch (error) {
    res.status(500).send({ message: "Erro ao atualizar produto", error });
  }
});

//@desc     Get all categories
//route     GET /api/products/categories
//@access   Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.status(200).json(categories);
});

//@desc     Get category by ID
//route     GET /api/products/categories/:categoryId
//@access   Public
const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar categoria", error });
  }
});

export {
  getProducts,
  createProduct,
  getCategories,
  getCategoryById,
  deleteProduct,
  changeStock,
};
