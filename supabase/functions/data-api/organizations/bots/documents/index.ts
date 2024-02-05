import { Router, Status } from "oak";
import { chunksRouter } from "./chunks/index.ts";
import { sbclient } from "../../../../_shared/supabase.ts";
import {getChunks} from "../../../../_shared/utils.ts"

const documentsRouter = new Router();

documentsRouter
  .get("/", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = "Listing all documents.";
  })
  .post("/", async (context) => {
    // Store the document in the database using Supabase client
    const orgId = context.params.orgId;
    const botId = context.params.botId;

    const { text, title, source_url, user_id } = await context.request.body()
      .value;
    console.log(text, title, source_url, user_id, orgId, botId);
    
    const chunks = await getChunks(text, 200);
    const { data: documentData, error: documentError } = await sbclient.rpc('create_document_with_chunks', {
			p_bot_id:botId,
			p_organization_id: orgId,
			p_user_id_owner: user_id,
			p_title: title,
			p_source_url: source_url,
			p_document_type: "text",
			p_chunks_info: chunks,
		});

    if (documentError) {
      context.response.status = Status.BadRequest;
      context.response.body = { documentError };
    } else {
      context.response.status = Status.OK;
      context.response.body = { documentData };
    }
  })
  .get("/:docId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Fetching document with ID: ${context.params.docId}`;
  })
  .put("/:docId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Updating document with ID: ${context.params.docId}`;
  })
  .delete("/:docId", (context) => {
    context.response.status = Status.NotImplemented;
    context.response.body = `Deleting document with ID: ${context.params.docId}`;
  })
  .use("/:docId/chunks", chunksRouter.routes(), chunksRouter.allowedMethods());

export { documentsRouter };
