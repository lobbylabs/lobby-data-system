import { Router, Status } from "oak";

const chunksRouter = new Router();

chunksRouter
  .get("/", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = "Listing all chunks for a specific document.";
  })
  .post("/", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = "Adding a new chunk to a specific document.";
  })
  .get("/:chunkId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Fetching chunk with ID: ${context.params.chunkId} for a specific document.`;
  })
  .put("/:chunkId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Updating chunk with ID: ${context.params.chunkId} for a specific document.`;
  })
  .delete("/:chunkId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Deleting chunk with ID: ${context.params.chunkId} for a specific document.`;
  });

export { chunksRouter };
