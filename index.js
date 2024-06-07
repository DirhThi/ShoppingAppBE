import express from "express";
import cors from "cors";
const app = express();
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import { authRouter } from "./routes/index.js";
import { productRouter } from "./routes/index.js";
import { cartItemRouter } from "./routes/index.js";
import { orderItemRouter } from "./routes/index.js";
import { feedbackItemRouter } from "./routes/index.js";
import { searchContentRouter } from "./routes/index.js";
import { connectToDB } from "./config/connectDB.js";
dotenv.config();
connectToDB();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(helmet());
app.use(cors());
app.use(morgan("common"));

//ROUTES
app.use("/api/", authRouter);
app.use("/api/products/", productRouter);
app.use("/api/cartItems/", cartItemRouter);
app.use("/api/orders/", orderItemRouter);
app.use("/api/feedbacks/", feedbackItemRouter);
app.use("/api/searchContents/", searchContentRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running...");
});
