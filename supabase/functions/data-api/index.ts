import { Application, Router } from "oak";
import { v1Router } from "./v1/index.ts";
import { getSupabaseClient } from "../_shared/supabase.ts";

const app = new Application();
const rootRouter = new Router();

// Combine routers under the /data-api base route
rootRouter.use("/data-api/v1", v1Router.routes(), v1Router.allowedMethods());

app
  .use(async (context, next) => {
    // console.log(context.request.headers);
    const sbclient = getSupabaseClient(
      context.request.headers.get("Authorization")
    );
    context.state.sbclient = sbclient;

    sbclient.functions.invoke



    await next();
  })
  .use(rootRouter.routes())
  .use(rootRouter.allowedMethods());

await app.listen({ port: 8000 });
// console.log("Server is running on http://localhost:8000/");
