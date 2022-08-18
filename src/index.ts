import express, { Express } from "express";
import * as bodyParser from "body-parser";
import { API_PORT } from "./config/main";

import homeRouter from "./routers/home";
import playerRouter from "./routers/players";
import matchRouter from "./routers/matches";
import ServerError from "./types/server.errors";
import FailResult from "./utils/results/failResult";
import userRouter from "./routers/users";


const port = process.env.PORT || API_PORT;

const app: Express = express();

app.use(bodyParser.json());

app.use("/", homeRouter);
app.use("/players", playerRouter);
app.use("/matches", matchRouter);
app.use("/users", userRouter);

/*
  Error Handler
*/

app.use((err: ServerError | Error, req: any, res: any, next: any) => {
  console.error(`Url: ${req.url}`);
  console.error(err.stack);

  res
    .status((err as ServerError).status || 500)
    .json(new FailResult(err.message));
});

/*
  404 Not Found - Handler
*/

app.use((req, res, next) => {
  res.status(404).json(new FailResult("Not Found"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
