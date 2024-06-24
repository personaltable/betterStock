import asyncHandler from "express-async-handler";
import Sales from "../models/saleModel.js";

const getSales = asyncHandler(async (req, res) => {
    const sales = await Sales.find();

    res.status(200).json(sales);
});

const registerSale = asyncHandler(async (req, res) => {
    console.log(req.body);
    try {
        const { randomRef: reference, salesInfo, userId: user } = req.body;
        console.log(reference);

        const information = salesInfo.map(item => ({
            product: item.product,
            quantity: item.quantity
        }));

        const newSales = new Sales({
            reference, information, user
        });

        console.log("New sales data:", newSales);

        const savedSales = await newSales.save();
        res.status(201).json(savedSales);
    } catch (error) {
        console.error("Error saving sales data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


export { getSales, registerSale };
