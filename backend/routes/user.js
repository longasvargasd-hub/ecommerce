import express from "express";
import {registraruser} from "../controllers/usercontrollers.js";
const router=express.Router();

//ruta para registrar el usuario
router.post("/register", registraruser);
export default router;




















