import asyncHandler from "express-async-handler";
import Sales from "../models/saleModel.js";

const getSales = asyncHandler(async (req, res) => {
    const sales = await Sales.find();

    res.status(200).json(sales);
});

const registerSale = asyncHandler(async (req, res) => {
    const { reference, information, user } = req.body;

    const newSales = new Sales({
        reference, information, user
    });

    console.log(newSales);

    const savedSales = await newSales.save();
    res.status(201).json(savedSales);
});

export { getSales, registerSale };
