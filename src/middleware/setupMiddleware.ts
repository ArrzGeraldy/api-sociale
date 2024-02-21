import { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";

const setupMiddleware = (app: Application) => {
  app.use(cors());
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
};

export default setupMiddleware;
