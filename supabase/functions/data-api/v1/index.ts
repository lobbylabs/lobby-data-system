import { Router } from "oak";
import { organizationsRouter } from "./organizations/index.ts";
import { usersRouter } from "./users/index.ts";
import { botsRouter } from "./bots/index.ts";
import { conversationsRouter } from "./conversations/index.ts";
import { messagesRouter } from "./messages/index.ts";
import { documentsRouter } from "./documents/index.ts";
import { chunksRouter } from "./chunks/index.ts";

const v1Router = new Router();

v1Router
  .use(
    "/organizations",
    organizationsRouter.routes(),
    organizationsRouter.allowedMethods()
  )

  .use(
    "/organizations/:orgId/bots",
    botsRouter.routes(),
    botsRouter.allowedMethods()
  )
  .use(
    "/organizations/:orgId/bots/:botId/documents",
    documentsRouter.routes(),
    documentsRouter.allowedMethods()
  )
  .use(
    "/organizations/:orgId/bots/:botId/documents/:docId/chunks",
    chunksRouter.routes(),
    chunksRouter.allowedMethods()
  )

  .use("/users", usersRouter.routes(), usersRouter.allowedMethods())
  .use(
    "/users/:userId/conversations",
    conversationsRouter.routes(),
    conversationsRouter.allowedMethods()
  )
  .use(
    "/users/:userId/conversations/:convId/messages",
    messagesRouter.routes(),
    messagesRouter.allowedMethods()
  );

export { v1Router };
