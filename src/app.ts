import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./docs";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./modules/auth/auth.routes";
import userRouter from "./modules/users/users.routes";
const app = express();

app.use(express.json());
app.use(cookieParser());

const router = express.Router();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

//Routes 
router.use("/auth", authRouter);
router.use("/users", userRouter);


// API Documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Main API route
app.use("/api/v1", router);

app.use(errorHandler);

export default app;
