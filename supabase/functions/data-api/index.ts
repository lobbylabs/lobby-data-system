import { Application, Router, Status } from "oak";
import { v1Router } from "./v1/index.ts";
import { getSupabaseClient } from "../_shared/supabase.ts";

const app = new Application();
const rootRouter = new Router();

// Combine routers under the /data-api base route
rootRouter.use("/data-api/v1", v1Router.routes(), v1Router.allowedMethods());
app.use(async (context, next) => {
  const sbclient = getSupabaseClient(
    context.request.headers.get("Authorization")
  );
  context.state.sbclient = sbclient;
  await next();
});
app.use(rootRouter.routes());
app.use(rootRouter.allowedMethods());

await app.listen({ port: 8000 });
console.log("Server is running on http://localhost:8000/");
