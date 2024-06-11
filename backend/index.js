import express from "express";
import cors from "cors";
import mainRouter from "./routes/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/v1", mainRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port} 🔥`);
});
