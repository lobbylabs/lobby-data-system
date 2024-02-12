import { Application, Router, Status } from "oak";
import { v1Router } from "./v1/index.ts";
// import swagger from 'swagger-ui-dist';
import { getSupabaseClient } from "../_shared/supabase.ts";
// import { oakCors } from "oakCors";

// import openapiJSON from "../_shared/openapi.json" with {
//   type: "json",
// };

// let SwaggerUIBundle;
//
// import('swagger-ui-dist').then((SwaggerUI) => {
//   SwaggerUIBundle = SwaggerUI.SwaggerUIBundle;
//   const ui = SwaggerUIBundle({
//     url: "https://petstore.swagger.io/v2/swagger.json",
//     dom_id: '#swagger-ui',
//     presets: [
//       SwaggerUIBundle.presets.apis,
//       SwaggerUIBundle.SwaggerUIStandalonePreset
//     ],
//     layout: "StandaloneLayout"
//   });
// }).catch(error => console.error('Failed to load SwaggerUI', error));

const app = new Application();
const rootRouter = new Router();

// Combine routers under the /data-api base route
rootRouter.use("/data-api/v1", v1Router.routes(), v1Router.allowedMethods());
// // rootRouter.get("/data-api/v1/docs", async (context, next) => {
// //   console.log(context.request.url);
// //   console.log(pathToSwaggerUi.absolutePath());
// //   try {
// //     await context.send({
// //       root: ``,
// //       index: `${pathToSwaggerUi.absolutePath()}`,
// //     });
// //   } catch {
// //     await next();
// //   }
// // });
// rootRouter.get("/data-api/v1/docs", (context) => {
//   context.response.status = Status.OK;
//   context.response.body =
//     `<!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="utf-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1" />
//       <meta name="description" content="SwaggerUI" />
//       <title>SwaggerUI</title>
//       <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
//     </head>
//     <body>
//     <div id="swagger-ui"></div>
//     <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
//     <script>
//       window.onload = () => {
//         window.ui = SwaggerUIBundle({
//           url: 'https://petstore3.swagger.io/api/v3/openapi.json',
//           dom_id: '#swagger-ui',
//         });
//       };
//     </script>
//     </body>
//     </html>`;
// context.response.redirect(swagger.absolutePath());
// for await (const dirEntry of Deno.readDir(swagger.absolutePath())) {
//   console.log(dirEntry.name);
//  }
// console.log(SwaggerUI({
//   dom_id: '#myDomId'
// }))
// const ui = SwaggerUIBundle.SwaggerUIBundle({
//   url: "https://petstore.swagger.io/v2/swagger.json",
//   dom_id: '#swagger-ui',
//   presets: [
//     SwaggerUIBundle.,
//     SwaggerUIBundle.SwaggerUIStandalonePreset
//   ],
//   layout: "StandaloneLayout"
// })
// console.log(ui)
// console.log(Deno.cwd())
// console.log(VERSION)
// await context.send({
//   root: `${Deno.cwd()}/_shared`,
//   index: "version.json",
// });

// const ui = SwaggerUIBundle({
//   url: "https://petstore.swagger.io/v2/swagger.json",
//   dom_id: '#swagger-ui',
//   presets: [
//     SwaggerUIBundle.presets.apis,
//     SwaggerUIBundle.SwaggerUIStandalonePreset
//   ],
//   layout: "StandaloneLayout"
// })
// context.response.body = {"test": "test"}
// });
// rootRouter.get("/data-api/v1/openapi.json", (context) => {
//   context.response.status = Status.OK;
//   context.response.body = openapiJSON;
// });
app
  .use(async (context, next) => {
    // console.log(context.request.headers);
    const sbclient = getSupabaseClient(
      context.request.headers.get("Authorization")
    );
    context.state.sbclient = sbclient;
    await next();
  })
  .use(rootRouter.routes())
  .use(rootRouter.allowedMethods());

await app.listen({ port: 8000 });
// console.log("Server is running on http://localhost:8000/");
