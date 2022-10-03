import express from "express";
import { validatePostClient } from "../midweres/validations.js";
import {
  postClient,
  getClients,
  getId,
} from "../controllers/clientsController.js";

const router = express.Router();

router.post("/customers", validatePostClient, postClient);
router.get("/customers", getClients);
router.get("/customers/:id", getId);

export default router;
