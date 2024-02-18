import { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";

const setupMiddleware = (app: Application) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });
};

export default setupMiddleware;
