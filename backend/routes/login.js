import express from "express";
import {loginusuario} from "../controllers/login.js";

const router =express.Router();


router.post("/", loginusuario);
export default router;