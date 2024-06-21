import asyncHandler from "express-async-handler";
import Client from "../models/clientModel.js";

const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find();

  res.status(200).json(clients);
});

const registerClient = asyncHandler(async (req, res) => {
  const { name, surName, nif, email, phone, address, postCode } = req.body;

  const newClient = new Client({
    name,
    surName,
    nif,
    email,
    phone,
    address,
    postCode,
  });

  console.log(newClient);

  const savedClient = await newClient.save();
  res.status(201).json(savedClient);
});

export { getClients, registerClient };
