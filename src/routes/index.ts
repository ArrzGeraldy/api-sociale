import { Application, Router } from "express";
import { EventRouter } from "./event.route";
import { AuthRouter } from "./auth.router";
import { CategoryRouter } from "./category.router";
import { UserRouter } from "./user.route";

const _routes: Array<[string, Router]> = [
  ["/event", EventRouter],
  ["/auth", AuthRouter],
  ["/category", CategoryRouter],
  ["/user", UserRouter],
];

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route;
    app.use(url, router);
  });
};
