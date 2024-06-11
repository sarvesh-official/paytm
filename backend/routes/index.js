import { Router } from "express";
import userRouter from "./user.js";
import { accountRouter } from "./account.js";

const mainRouter = Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/account", accountRouter);

export default mainRouter;
