import { register, login } from "../Controllers/AuthController.js";
import { checkUser } from "../Middlewares/AuthMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/", checkUser);
router.post("/signup", register);
router.post("/login", login);

export default router;

