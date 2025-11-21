import express from "express";
import { obtenerPerfil } from "../controllers/perfil.js";

const router = express.Router();

router.post('/obtener', obtenerPerfil);

export default router;