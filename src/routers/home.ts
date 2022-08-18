import express from "express";

const homeRouter = express.Router();

homeRouter.get("/", (req, res) => {
  res.send("Success, connection secure!");
});

export default homeRouter;
