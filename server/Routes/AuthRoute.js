import { Signup, Login } from "../Controllers/AuthController.js";
import { userVerification } from "../Middlewares/AuthMiddleware.js";
import { Router } from "express";

const router = Router();

router.post('/', userVerification);

router.post("/signup", Signup);

router.post('/login', Login);

export default router;
