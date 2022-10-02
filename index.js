import express from "express";
import cors from "cors";
import cateforyRouter from "./src/routers/categoryRouter.js";

const app = start();

app.use(cateforyRouter);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});

function start() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  return app;
}
