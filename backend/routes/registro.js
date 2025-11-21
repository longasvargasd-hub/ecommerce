import express from "express";
import { registrarUsuario } from "../controllers/registro.js";

const router = express.Router();

router.post("/", registrarUsuario);

export default router;