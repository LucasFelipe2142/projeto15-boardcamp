import express from "express";
import { validatePostClient } from "../midweres/validations.js";
import {
  postClient,
  getClients,
  getId,
  updateClient,
} from "../controllers/clientsController.js";

const router = express.Router();

router.post("/customers", validatePostClient, postClient);
router.get("/customers", getClients);
router.get("/customers/:id", getId);
router.put("/customers/:id", validatePostClient, updateClient);

export default router;
