import express from "express";
import { validatePostClient } from "../midweres/validations.js";
import { postRental, getRentals } from "../controllers/rentalsController.js";

const router = express.Router();

router.post("/rentals", postRental);
router.get("/rentals", getRentals);
//router.get("/customers/:id", getId);

export default router;
