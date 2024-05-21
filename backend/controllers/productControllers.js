import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

//@desc     Auth user/ set token
//route     POST api/users/auth
//@access   Public
const getProducts = asyncHandler(async (req, res) => {

       const products = await Product.find(); 

});

export {getProducts};