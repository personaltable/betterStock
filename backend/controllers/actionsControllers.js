import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Actions from "../models/actionsModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

//@desc     Get all actions
//route     GET /api/actions/
//@access   Public
const getActions = asyncHandler(async (req, res) => {
    const actions = await Actions.find()
        .populate("product", "name")
        .populate("user", "name");

    res.status(200).json(actions);
});


//@desc     Create action
//route     POST /api/actions/
//@access   Public
const createAction = asyncHandler(async (req, res) => {
    const { name, product, changes, user } = req.body;

    console.log(req.body);

    const getUser = await User.findOne({ name: user });
    if (!getUser) {
        return res.status(400).json({ message: "User not found" });
    }
    const userId = mongoose.Types.ObjectId(getUser._id);

    const action = new Actions({
        name,
        product: product,
        changes: changes,
        user: userId
    });

    const savedAction = await action.save();
    res.status(201).json(savedAction);
});

export { getActions, createAction };