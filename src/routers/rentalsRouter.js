import express from "express";
import { validatePostClient } from "../midweres/validations.js";
import {
  postRental,
  getRentals,
  postCompleteRental,
  deleteRentals,
} from "../controllers/rentalsController.js";

const router = express.Router();

router.post("/rentals", postRental);
router.get("/rentals", getRentals);
router.post("/rentals/:id/return", postCompleteRental);
router.delete("/rentals/:id", deleteRentals);

export default router;
