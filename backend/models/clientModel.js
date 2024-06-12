import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const clientSchema = mongoose.Schema(
  {
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
      required: true,
      unique: true,
    },
    postCode: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//encrypt password
clientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compare String password with encrypt password
clientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Client = mongoose.model("User", clientSchema);

export default Client;
