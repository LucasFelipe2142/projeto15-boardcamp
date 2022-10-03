import express from "express";
import cors from "cors";
import cateforyRouter from "./src/routers/categoryRouter.js";
import gamesRouter from "./src/routers/gamesRouter.js";
import clientsRouter from "./src/routers/clientsRouter.js";
import rentalsRouter from "./src/routers/rentalsRouter.js";

const app = start();

app.use(cateforyRouter);
app.use(gamesRouter);
app.use(clientsRouter);
app.use(rentalsRouter);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});

function start() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  return app;
}
