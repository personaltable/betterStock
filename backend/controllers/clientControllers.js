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

const deleteClients = asyncHandler(async (req, res) => {
  const clientId = req.params.id; // Assuming the client ID is passed as a route parameter

  // Find client by ID and delete
  const deletedClient = await Client.findByIdAndDelete(clientId);

  if (deletedClient) {
    res.status(200).json({ message: "Cliente deletado com sucesso" });
  } else {
    res.status(404);
    throw new Error("Cliente não encontrado");
  }
});

export { getClients, registerClient, deleteClients };
