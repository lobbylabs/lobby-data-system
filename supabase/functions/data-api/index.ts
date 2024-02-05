import { Application, Router } from "oak";
import { usersRouter } from "./users/index.ts";
import { organizationsRouter } from "./organizations/index.ts";

const app = new Application();
const router = new Router();

// Combine routers under the /data-api base route
router.use(
  "/data-api/users",
  usersRouter.routes(),
  usersRouter.allowedMethods()
);
router.use(
  "/data-api/organizations",
  organizationsRouter.routes(),
  organizationsRouter.allowedMethods()
);


app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
console.log("Server is running on http://localhost:8000/");
