import { Application, Router } from "oak";
import { v1Router } from "./v1/index.ts";

const app = new Application();
const rootRouter = new Router();

// Combine routers under the /data-api base route
rootRouter.use("/data-api/v1", v1Router.routes(), v1Router.allowedMethods());
// app.use(async (context, next) => {
//   await next();
//   const rt = context.response.headers.get("X-Response-Time");
//   console.log(
//     `${context.request.method} ${decodeURIComponent(
//       context.request.url.pathname
//     )} - ${String(rt)}`
//   );
// });
app.use(rootRouter.routes());
app.use(rootRouter.allowedMethods());

await app.listen({ port: 8000 });
console.log("Server is running on http://localhost:8000/");
