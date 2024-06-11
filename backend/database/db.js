import { mongoose } from "mongoose";

import dotenv from "dotenv";

dotenv.config();

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    minLength: 3,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    maxLength: 30,
  },
  lastName: { type: String, required: true, maxLength: 30 },
  password: { type: String, required: true, trim: true },
});

export const User = mongoose.model("users", userSchema);

//* Account Schema
const accountSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  balance: {
    type: Number,
    required: true,
  },
});

export const Account = mongoose.model("Account", accountSchema);

mongoose.connect(process.env.MONGO_URI);
