import express from "express";
import { validaPostName } from "../midweres/validations.js";
import {
  postCategory,
  getCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/categoria", validaPostName, postCategory);
router.get("/categoria", getCategory);

export default router;
