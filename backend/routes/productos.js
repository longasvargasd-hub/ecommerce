import express from "express";
import {createproductos, obtenerproductos}from "../controllers/productos.js";

const router = express.Router()
//
router.post("/", createproductos);

//obtener productos
router.get("/", obtenerproductos);
export default router