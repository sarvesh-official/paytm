import { Router } from "express";
import { Account } from "../database/db.js";
import { authMiddleware } from "../middleware.js";
import mongoose from "mongoose";

const accountRouter = Router();

accountRouter.get("/balance", authMiddleware, async (req, res) => {
  const userId = req.userId;

  const account = await Account.findOne({ userId: userId });

  if (!account)
    return res.status(404).json({ message: "Account Doesn't Exists" });

  return res.status(200).json({ balance: account.balance });
});

// * Amount Transfer
accountRouter.post("/transfer", authMiddleware, async (req, res) => {
  const { to, amount } = req.body;

  if (!to || !amount) {
    return res.status(403).json({ message: "Invaid Input" });
  }

  const session = await mongoose.startSession();

  session.startTransaction();

  const fromAccount = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!fromAccount || fromAccount.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient Balance",
    });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid Account",
    });
  }

  // * Transferring Data
  await Account.updateOne(
    { userId: req.userId },
    {
      $inc: {
        balance: -amount,
      },
    }
  ).session(session);

  await Account.updateOne(
    { userId: to },
    {
      $inc: {
        balance: amount,
      },
    }
  ).session(session);

  // Commit the transaction
  await session.commitTransaction();

  res.json({
    message: "Transfer Successful",
  });
});

export { accountRouter };
