import { Router } from "express";
import { z } from "zod";
import { Account, User } from "../database/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middleware.js";

const userRouter = Router();

const signUpZod = z.object({
  email: z.string().email(),
  firstName: z.string().min(3),
  lastName: z.string().min(1),
  password: z.string().min(6),
});

const signInZod = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// * SignUp Route

userRouter.post("/signUp", async (req, res) => {
  const { success } = signUpZod.safeParse(req.body);

  if (!success) return res.status(411).json({ message: "Incorrect inputs" });

  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    return res.status(403).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = await User.create({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashedPassword,
  });

  const userId = newUser._id;

  // * Creating Bank Account and Initializing Balance

  const account = await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign({ userId }, process.env.JWT_SECRET);

  res.json({
    message: "User created successfully",
    balance: account.balance,
    token: token,
  });
});

// * SignIn Route

userRouter.post("/signIn", async (req, res) => {
  const { success } = signInZod.safeParse(req.body);

  if (!success) return res.status(411).json({ message: "Incorrect inputs" });

  const user = await User.findOne({
    email: req.body.email,
  });

  if (user) {
    const decryptedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!decryptedPassword) {
      return res.json({ message: "Incorrect Password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    return res.status(200).json({ token, message: "Logged in Successful" });
  }

  res.json({ message: "Error Logging In" });
});

// * Update Route

const updateBody = z.object({
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

userRouter.put("/update", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({ message: "Invalid Inputs" });
  }

  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const updateUser = await User.updateOne({ _id: req.userId }, req.body);

    return res.json({
      message: "Updated successfully",
    });
  } else {
    const updateUser = await User.updateOne({ _id: req.userId }, req.body);

    return res.json({
      message: "Updated successfully",
    });
  }
});

userRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    users: users.map((user) => ({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

export default userRouter;
