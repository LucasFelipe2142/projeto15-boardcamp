import express from "express";
import { validatePostGame } from "../midweres/validations.js";
import { postgames, getGames } from "../controllers/gamesControler.js";

const router = express.Router();

router.post("/games", validatePostGame, postgames);
router.get("/games", getGames);

export default router;
