import mongoose from "mongoose";

const clientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surName: {
    type: String,
    required: true,
  },
  nif: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    unique: true,
  },
  postCode: {
    type: String,
  },
});

const Client = mongoose.model("Client", clientSchema);

export default Client;
