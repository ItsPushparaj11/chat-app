import express from "express";
import { register, login } from "../controlllers/userController.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);

export default router;