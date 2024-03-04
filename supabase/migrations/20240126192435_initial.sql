-- Enable vector extension (pg_vector)
CREATE EXTENSION vector WITH SCHEMA extensions;

-- Create data schema to store tables and functions
CREATE SCHEMA data
-- Grant permissions for data schema
-- GRANT ALL ON SCHEMA data TO service_role;
GRANT USAGE ON SCHEMA data TO service_role;

GRANT ALL ON ALL TABLES IN SCHEMA data TO service_role;

-- GRANT ALL ON ALL ROUTINES IN SCHEMA data TO service_role;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA data TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA data GRANT ALL ON TABLES TO service_role;

-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA data GRANT ALL ON ROUTINES TO service_role;
-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA data GRANT ALL ON SEQUENCES TO service_role;
-- Create tables
CREATE TABLE data.users(
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE data.organizations(
    id uuid NOT NULL PRIMARY KEY UNIQUE DEFAULT gen_random_uuid(),
    user_id_owner uuid NOT NULL REFERENCES data.users(id),
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE data.organization_members(
    user_id uuid REFERENCES data.users(id),
    organization_id uuid REFERENCES data.organizations(id),
    user_scopes text[] DEFAULT '{}',
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT organization_members_pkey PRIMARY KEY (user_id, organization_id)
);

-- Organization Bots
CREATE TABLE data.bots(
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES data.organizations(id),
    user_id_owner uuid NOT NULL REFERENCES data.users(id),
    system_prompt text NOT NULL DEFAULT '',
    bot_summary text NULL,
    bot_summary_embedding_ada_002 extensions.vector(1536) NULL,
    bot_summary_embedding_jina_v2_base_en extensions.vector(768) NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

-- CREATE INDEX ON data.bots USING hnsw(bot_summary_embedding_ada_002 vector_l2_ops) WITH (m = 16, ef_construction = 64);
-- CREATE INDEX ON data.bots USING hnsw(bot_summary_embedding_jina_v2_base_en vector_l2_ops) WITH (m = 16, ef_construction = 64);
-- Organization Documents
CREATE TABLE data.documents(
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES data.organizations(id),
    title varchar(255) NOT NULL,
    author varchar(255) NULL,
    source_url varchar(2048) NULL,
    document_type varchar(100) NULL,
    content text NULL,
    content_size_kb integer NULL,
    content_embedding_ada_002 extensions.vector(1536) NULL,
    content_embedding_jina_v2_base_en extensions.vector(768) NULL,
    document_summary text NULL,
    document_summary_embedding_ada_002 extensions.vector(1536) NULL,
    document_summary_embedding_jina_v2_base_en extensions.vector(768) NULL,
    mime_type varchar(100) NULL,
    num_chunks integer NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

-- CREATE INDEX ON data.documents USING hnsw(content_embedding_ada_002 vector_l2_ops) WITH (m = 16, ef_construction = 64);
-- CREATE INDEX ON data.documents USING hnsw(document_summary_embedding_ada_002 vector_l2_ops) WITH (m = 16, ef_construction = 64);
-- CREATE INDEX ON data.documents USING hnsw(content_embedding_jina_v2_base_en vector_l2_ops) WITH (m = 16, ef_construction = 64);
-- CREATE INDEX ON data.documents USING hnsw(document_summary_embedding_jina_v2_base_en vector_l2_ops) WITH (m = 16, ef_construction = 64);
-- Organization Document Chunks
CREATE TABLE data.document_chunks(
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES data.organizations(id),
    document_id uuid NOT NULL REFERENCES data.documents(id),
    chunk_content text NOT NULL,
    chunk_content_embedding_ada_002 extensions.vector(1536) NULL,
    chunk_content_embedding_jina_v2_base_en extensions.vector(768) NULL,
    prev_chunk uuid NULL REFERENCES data.document_chunks(id),
    next_chunk uuid NULL REFERENCES data.document_chunks(id),
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

-- CREATE INDEX ON data.document_chunks USING hnsw(chunk_content_embedding_ada_002 vector_l2_ops) WITH (m = 16, ef_construction = 64);
-- CREATE INDEX ON data.document_chunks USING hnsw(chunk_content_embedding_jina_v2_base_en vector_l2_ops) WITH (m = 16, ef_construction = 64);
-- Bot Documents
CREATE TABLE data.bot_documents(
    organization_id uuid REFERENCES data.organizations(id),
    bot_id uuid REFERENCES data.bots(id),
    document_id uuid REFERENCES data.documents(id)
);

-- User Conversations
CREATE TABLE data.conversations(
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES data.users(id),
    organization_id uuid NULL REFERENCES data.organizations(id),
    bot_id uuid NULL REFERENCES data.bots(id),
    conversation_summary text NULL,
    conversation_summary_embedding_ada_002 extensions.vector(1536) NULL,
    conversation_summary_embedding_jina_v2_base_en extensions.vector(768) NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

-- CREATE INDEX ON data.conversations USING hnsw(conversation_summary_embedding_ada_002 vector_l2_ops) WITH (m = 16, ef_construction = 64);
-- CREATE INDEX ON data.conversations USING hnsw(conversation_summary_embedding_jina_v2_base_en vector_l2_ops) WITH (m = 16, ef_construction = 64);
-- User Messages
CREATE TABLE data.messages(
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    organization_id uuid NULL REFERENCES data.organizations(id),
    bot_id uuid NULL REFERENCES data.bots(id),
    conversation_id uuid NOT NULL REFERENCES data.conversations(id),
    message_type varchar(100) NOT NULL,
    message_index bigint NOT NULL,
    message_content text NOT NULL,
    message_content_embedding_ada_002 extensions.vector(1536) NULL,
    message_content_embedding_jina_v2_base_en extensions.vector(768) NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

-- CREATE INDEX ON data.messages USING hnsw(message_content_embedding_ada_002 vector_l2_ops) WITH (m = 16, ef_construction = 64);
-- CREATE INDEX ON data.messages USING hnsw(message_content_embedding_jina_v2_base_en vector_l2_ops) WITH (m = 16, ef_construction = 64);
ALTER TABLE data.bots ENABLE ROW LEVEL SECURITY;

ALTER TABLE data.documents ENABLE ROW LEVEL SECURITY;

ALTER TABLE data.document_chunks ENABLE ROW LEVEL SECURITY;

ALTER TABLE data.bot_documents ENABLE ROW LEVEL SECURITY;

ALTER TABLE data.conversations ENABLE ROW LEVEL SECURITY;

ALTER TABLE data.messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE data.users ENABLE ROW LEVEL SECURITY;

ALTER TABLE data.organizations ENABLE ROW LEVEL SECURITY;

-- Triggers on new organization creation
-- CREATE OR REPLACE FUNCTION data.on_insert_organization()
--     RETURNS TRIGGER
--     AS $$
-- DECLARE
--     partition_id text;
--     partition_name_documents text;
--     partition_name_bots text;
--     partition_name_bot_documents text;
-- BEGIN
--     partition_id := replace(NEW.id::text, '-', '_');
--     -- For documents
--     partition_name_documents := 'documents_p_' || partition_id;
--     IF NOT EXISTS (
--         SELECT
--         FROM
--             pg_class
--         WHERE
--             relname = partition_name_documents
--             AND relkind = 'r') THEN
--     EXECUTE format('CREATE TABLE data.%I PARTITION OF data.documents FOR VALUES IN (%L);', partition_name_documents, NEW.id);
-- END IF;
--     -- For bots
--     partition_name_bots := 'bots_p_' || partition_id;
--     IF NOT EXISTS (
--         SELECT
--         FROM
--             pg_class
--         WHERE
--             relname = partition_name_bots
--             AND relkind = 'r') THEN
--     EXECUTE format('CREATE TABLE data.%I PARTITION OF data.bots FOR VALUES IN (%L);', partition_name_bots, NEW.id);
-- END IF;
--     -- For bot_documents
--     partition_name_bot_documents := 'bot_documents_p_' || partition_id;
--     IF NOT EXISTS (
--         SELECT
--         FROM
--             pg_class
--         WHERE
--             relname = partition_name_bot_documents
--             AND relkind = 'r') THEN
--     EXECUTE format('CREATE TABLE data.%I PARTITION OF data.bot_documents FOR VALUES IN (%L);', partition_name_bot_documents, NEW.id);
-- END IF;
--     RETURN NULL;
-- END;
-- $$
-- LANGUAGE plpgsql
-- SECURITY DEFINER;
-- CREATE TRIGGER trigger_on_organization_insert
--     AFTER INSERT ON data.organizations
--     FOR EACH ROW
--     EXECUTE PROCEDURE data.on_insert_organization();
-- --
-- -- Triggers on new document creation
-- CREATE OR REPLACE FUNCTION data.on_insert_document()
--     RETURNS TRIGGER
--     AS $$
-- DECLARE
--     partition_name text;
-- BEGIN
--     -- Construct the partition table name
--     partition_name := 'document_chunks_p_' || replace(NEW.id::text, '-', '_');
--     -- Check if the partition already exists
--     IF NOT EXISTS (
--         SELECT
--         FROM
--             pg_class
--         WHERE
--             relname = partition_name
--             AND relkind = 'r') THEN
--     -- Create the partition if it does not exist
--     EXECUTE format('CREATE TABLE data.%I PARTITION OF data.document_chunks FOR VALUES IN (%L);', partition_name, NEW.id);
-- END IF;
--     RETURN NULL;
-- END;
-- $$
-- LANGUAGE plpgsql
-- SECURITY DEFINER;
-- -- CREATE TRIGGER trigger_on_documents_insert
-- --     AFTER INSERT ON data.documents
-- --     FOR EACH ROW
-- --     EXECUTE PROCEDURE data.on_insert_document();
-- --
-- -- Triggers on new user creation
-- CREATE OR REPLACE FUNCTION data.on_user_insert()
--     RETURNS TRIGGER
--     AS $$
-- DECLARE
--     partition_name_conversations text;
--     partition_name_messages text;
--     lock_key CONSTANT bigint := 123456;
-- BEGIN
--     -- IF NOT pg_try_advisory_xact_lock(lock_key) THEN
--     --     RAISE NOTICE 'Could not acquire lock, skipping partition creation.';
--     --     RETURN;
--     -- END IF;
--     -- Construct the partition table names
--     partition_name_conversations := 'conversations_p_' || replace(NEW.id::text, '-', '_');
--     partition_name_messages := 'messages_p_' || replace(NEW.id::text, '-', '_');
--     -- Check if the conversations partition already exists
--     IF NOT EXISTS (
--         SELECT
--         FROM
--             pg_class
--         WHERE
--             relname = partition_name_conversations
--             AND relkind = 'r') THEN
--     -- Create the partition if it does not exist
--     EXECUTE format('CREATE TABLE data.%I PARTITION OF data.conversations FOR VALUES IN (%L);', partition_name_conversations, NEW.id);
-- END IF;
--     -- Check if the messages partition already exists
--     IF NOT EXISTS (
--         SELECT
--         FROM
--             pg_class
--         WHERE
--             relname = partition_name_messages
--             AND relkind = 'r') THEN
--     -- Create the partition if it does not exist
--     EXECUTE format('CREATE TABLE data.%I PARTITION OF data.messages FOR VALUES IN (%L);', partition_name_messages, NEW.id);
-- END IF;
--     RETURN NULL;
-- END;
-- $$
-- LANGUAGE plpgsql
-- SECURITY DEFINER;
-- CREATE TRIGGER trigger_on_user_insert
--     AFTER INSERT ON data.users
--     FOR EACH ROW
--     EXECUTE PROCEDURE data.on_user_insert();
-- CREATE OR REPLACE FUNCTION data.create_user_partitions(p_user_id uuid)
--     RETURNS void
--     AS $$
-- DECLARE
--     partition_name_conversations text;
--     partition_name_messages text;
-- BEGIN
--     -- Construct the partition table names
--     partition_name_conversations := 'conversations_p_' || replace(p_user_id::text, '-', '_');
--     partition_name_messages := 'messages_p_' || replace(p_user_id::text, '-', '_');
--     -- Check if the conversations partition already exists
--     IF NOT EXISTS (
--         SELECT
--             1
--         FROM
--             pg_class
--             JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
--         WHERE
--             pg_namespace.nspname = 'data'
--             AND relname = partition_name_conversations
--             AND relkind = 'r') THEN
--     -- Create the partition if it does not exist
--     EXECUTE format('CREATE TABLE data.%I PARTITION OF data.conversations FOR VALUES IN (%L);', partition_name_conversations, p_user_id);
-- END IF;
--     -- Check if the messages partition already exists
--     IF NOT EXISTS (
--         SELECT
--             1
--         FROM
--             pg_class
--             JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
--         WHERE
--             pg_namespace.nspname = 'data'
--             AND relname = partition_name_messages
--             AND relkind = 'r') THEN
--     -- Create the partition if it does not exist
--     EXECUTE format('CREATE TABLE data.%I PARTITION OF data.messages FOR VALUES IN (%L);', partition_name_messages, p_user_id);
-- END IF;
-- END;
-- $$
-- LANGUAGE plpgsql
-- SECURITY DEFINER;
--
CREATE OR REPLACE FUNCTION data.create_bot(p_organization_id uuid, p_user_id_owner uuid, p_system_prompt text DEFAULT '', p_overwrite_id uuid DEFAULT NULL)
    RETURNS SETOF data.bots
    AS $$
BEGIN
    -- Use the RETURN QUERY to execute the INSERT and return the result
    IF p_overwrite_id IS NULL THEN
        RETURN QUERY INSERT INTO data.bots(organization_id, user_id_owner, system_prompt)
            VALUES(p_organization_id, p_user_id_owner, p_system_prompt)
        RETURNING
            *;
    ELSE
        RETURN QUERY INSERT INTO data.bots(id, organization_id, user_id_owner, system_prompt)
            VALUES(p_overwrite_id, p_organization_id, p_user_id_owner, p_system_prompt)
        RETURNING
            *;
    END IF;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.document_chunk_similarity_search(p_organization_id uuid, p_bot_id uuid, p_user_id uuid, p_threshold float, p_k int, p_embedding_ada_002 extensions.vector(1536) DEFAULT NULL, p_embedding_jina_v2_base_en extensions.vector(768) DEFAULT NULL)
    RETURNS TABLE(
        id uuid,
        organization_id uuid,
        document_id uuid,
        chunk_content text,
        prev_chunk uuid,
        next_chunk uuid,
        similarity float
    )
    AS $$
BEGIN
    -- Check if the bot belongs to the specified user and organization
    IF NOT EXISTS(
        SELECT
            1
        FROM
            data.bots
        WHERE
            data.bots.id = p_bot_id
            AND(data.bots.organization_id = p_organization_id
                OR p_bot_id = '54071be6-bb05-4922-8636-335c1bcce0f8')) THEN
    RAISE EXCEPTION 'The specified bot does not belong to or organization.';
END IF;
    IF p_embedding_ada_002 IS NOT NULL THEN
        -- Perform the main query
        RETURN QUERY
        SELECT
            data.document_chunks.id,
            data.document_chunks.organization_id,
            data.document_chunks.document_id,
            data.document_chunks.chunk_content,
            data.document_chunks.prev_chunk,
            data.document_chunks.next_chunk,
            1 -(data.document_chunks.chunk_content_embedding_ada_002 <=> p_embedding_ada_002) AS similarity
        FROM
            data.document_chunks
            JOIN data.bot_documents ON data.document_chunks.document_id = data.bot_documents.document_id
        WHERE
            data.bot_documents.bot_id = p_bot_id
            AND data.bot_documents.organization_id = p_organization_id
            AND 1 -(data.document_chunks.chunk_content_embedding_ada_002 <=> p_embedding_ada_002) > p_threshold
        ORDER BY
(data.document_chunks.chunk_content_embedding_ada_002 <=> p_embedding_ada_002) ASC
        LIMIT p_k;
    ELSIF p_embedding_jina_v2_base_en IS NOT NULL THEN
        -- Perform the main query
        RETURN QUERY
        SELECT
            data.document_chunks.id,
            data.document_chunks.organization_id,
            data.document_chunks.document_id,
            data.document_chunks.chunk_content,
            data.document_chunks.prev_chunk,
            data.document_chunks.next_chunk,
            1 -(data.document_chunks.chunk_content_embedding_jina_v2_base_en <=> p_embedding_jina_v2_base_en) AS similarity
        FROM
            data.document_chunks
            JOIN data.bot_documents ON data.document_chunks.document_id = data.bot_documents.document_id
        WHERE
            data.bot_documents.bot_id = p_bot_id
            AND data.bot_documents.organization_id = p_organization_id
            AND 1 -(data.document_chunks.chunk_content_embedding_jina_v2_base_en <=> p_embedding_jina_v2_base_en) > p_threshold
        ORDER BY
(data.document_chunks.chunk_content_embedding_jina_v2_base_en <=> p_embedding_jina_v2_base_en) ASC
        LIMIT p_k;
    ELSE
        RAISE EXCEPTION 'Invalid vector type';
    END IF;
END
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.create_document(p_bot_id uuid, p_organization_id uuid, p_title varchar(255), p_author varchar(255) DEFAULT NULL, p_source_url varchar(2048) DEFAULT NULL, p_document_type varchar(100) DEFAULT NULL, p_content text DEFAULT NULL, p_content_size_kb integer DEFAULT NULL, p_content_embedding_ada_002 extensions.vector(1536) DEFAULT NULL, p_content_embedding_jina_v2_base_en extensions.vector(768) DEFAULT NULL, p_document_summary text DEFAULT NULL, p_document_summary_embedding_ada_002 extensions.vector(1536) DEFAULT NULL, p_document_summary_embedding_jina_v2_base_en extensions.vector(768) DEFAULT NULL, p_mime_type varchar(100) DEFAULT NULL, p_overwrite_id uuid DEFAULT NULL)
    RETURNS SETOF data.documents
    AS $$
DECLARE
    _doc_id uuid;
BEGIN
    -- Check if the bot belongs to the specified user and organization
    IF NOT EXISTS (
        SELECT
            1
        FROM
            data.bots
        WHERE
            data.bots.id = p_bot_id
            AND organization_id = p_organization_id) THEN
    RAISE EXCEPTION 'The specified bot was not found in the given organization.';
END IF;
    -- Insert the document record and get the generated id
    IF p_overwrite_id IS NULL THEN
        INSERT INTO data.documents(organization_id, title, author, source_url, document_type, content, content_size_kb, content_embedding_ada_002, content_embedding_jina_v2_base_en, document_summary, document_summary_embedding_ada_002, document_summary_embedding_jina_v2_base_en, mime_type, num_chunks -- This field will be updated after chunks insertion
)
            VALUES (p_organization_id, p_title, p_author, p_source_url, p_document_type, p_content, p_content_size_kb, p_content_embedding_ada_002, p_content_embedding_jina_v2_base_en, p_document_summary, p_document_summary_embedding_ada_002, p_document_summary_embedding_jina_v2_base_en, p_mime_type, 0 -- Initialize with 0, will update later
)
        RETURNING
            data.documents.id INTO _doc_id;
    ELSE
        INSERT INTO data.documents(id, organization_id, title, author, source_url, document_type, content, content_size_kb, content_embedding_ada_002, content_embedding_jina_v2_base_en, document_summary, document_summary_embedding_ada_002, document_summary_embedding_jina_v2_base_en, mime_type, num_chunks -- This field will be updated after chunks insertion
)
            VALUES (p_overwrite_id, p_organization_id, p_title, p_author, p_source_url, p_document_type, p_content, p_content_size_kb, p_content_embedding_ada_002, p_content_embedding_jina_v2_base_en, p_document_summary, p_document_summary_embedding_ada_002, p_document_summary_embedding_jina_v2_base_en, p_mime_type, 0 -- Initialize with 0, will update later
)
        RETURNING
            data.documents.id INTO _doc_id;
    END IF;
    RAISE NOTICE '_doc_id(%)', _doc_id;
INSERT INTO data.bot_documents(organization_id, bot_id, document_id)
    VALUES (p_organization_id, p_bot_id, _doc_id);
    RETURN QUERY
    SELECT
        *
    FROM
        data.documents
    WHERE
        data.documents.id = _doc_id;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.create_document_chunks(p_document_id uuid, p_bot_id uuid, p_organization_id uuid, p_chunks_info json)
    RETURNS SETOF data.document_chunks
    AS $$
DECLARE
    _chunk json;
    _previous_chunk_id uuid := NULL;
    _current_chunk_id uuid;
    _num_chunks integer := 0;
    _chunk_content_embedding_ada_002 extensions.vector(1536);
    _chunk_content_embedding_jina_v2_base_en extensions.vector(768);
BEGIN
    -- Ensure that the p_chunks_info array is not empty
    IF json_array_length(p_chunks_info) = 0 THEN
        RAISE EXCEPTION 'The document_chunks array must contain at least one chunk.';
    END IF;
    -- Check if the bot exists in the organization
    IF NOT EXISTS (
        SELECT
            1
        FROM
            data.bots
        WHERE
            data.bots.id = p_bot_id
            AND organization_id = p_organization_id) THEN
    RAISE EXCEPTION 'The specified bot was not found in the given organization.';
END IF;
    -- Check if the document exists in the organization
    IF NOT EXISTS (
        SELECT
            1
        FROM
            data.documents
        WHERE
            data.documents.id = p_document_id
            AND organization_id = p_organization_id) THEN
    RAISE EXCEPTION 'The specified document was not found in the given organization.';
END IF;
    -- Loop through each chunk in the p_chunks_info and insert them
    FOR _chunk IN
    SELECT
        *
    FROM
        json_array_elements(p_chunks_info)
        LOOP
            _num_chunks := _num_chunks + 1;
            RAISE NOTICE '_num_chunks: %', _num_chunks;
            -- Increment the chunk count
            -- Perform the conversion here before the INSERT statement
            BEGIN
                BEGIN
                    _chunk_content_embedding_ada_002 := ARRAY (
                        SELECT
                            json_array_elements_text(_chunk -> 'chunk_content_embedding_ada_002')::float)::extensions.vector(1536);
                EXCEPTION
                    WHEN OTHERS THEN
                        _chunk_content_embedding_ada_002 := NULL;
                RAISE NOTICE 'Conversion error for chunk_content_embedding_ada_002: %', SQLERRM;
                END;
            BEGIN
                _chunk_content_embedding_jina_v2_base_en := ARRAY (
                    SELECT
                        json_array_elements_text(_chunk -> 'chunk_content_embedding_jina_v2_base_en')::float)::extensions.vector(768);
            EXCEPTION
                WHEN OTHERS THEN
                    _chunk_content_embedding_jina_v2_base_en := NULL;
            RAISE NOTICE 'Conversion error for chunk_content_embedding_jina_v2_base_en: %', SQLERRM;
            END;
            END;
        INSERT INTO data.document_chunks(organization_id, document_id, chunk_content, chunk_content_embedding_ada_002, chunk_content_embedding_jina_v2_base_en, prev_chunk)
            VALUES (p_organization_id, p_document_id, _chunk ->> 'chunk_content', _chunk_content_embedding_ada_002, _chunk_content_embedding_jina_v2_base_en, _previous_chunk_id)
        RETURNING
            data.document_chunks.id INTO _current_chunk_id;
    -- Update the next_chunk field of the previous chunk with the current chunk's id
    IF _previous_chunk_id IS NOT NULL THEN
        UPDATE
            data.document_chunks
        SET
            next_chunk = _current_chunk_id
        WHERE
            data.document_chunks.id = _previous_chunk_id;
        END IF;
    _previous_chunk_id := _current_chunk_id;
END LOOP;
    -- Now that all chunks have been inserted, update the num_chunks field in the documents table
    RAISE NOTICE '_num_chunks: %', _num_chunks;
    UPDATE
        data.documents
    SET
        num_chunks = _num_chunks
    WHERE
        data.documents.id = p_document_id;
    RETURN QUERY
    SELECT
        *
    FROM
        data.document_chunks dc
    WHERE
        dc.document_id = p_document_id;
END;

$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.get_documents(p_bot_id uuid, p_organization_id uuid)
    RETURNS SETOF data.documents
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.*
    FROM
        data.documents d
        JOIN data.bot_documents bd ON bd.document_id = d.id
    WHERE
        bd.bot_id = p_bot_id
        AND bd.organization_id = p_organization_id
    ORDER BY
        d.updated_at DESC;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.get_document(p_document_id uuid, p_bot_id uuid, p_organization_id uuid)
    RETURNS SETOF data.documents
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.*
    FROM
        data.documents d
        JOIN data.bot_documents bd ON bd.document_id = d.id
    WHERE
        bd.bot_id = p_bot_id
        AND bd.organization_id = p_organization_id
        AND bd.document_id = p_document_id;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- creates a new user and org or adds new user to existing org if org id is provided
CREATE OR REPLACE FUNCTION data.create_user(p_organization_id uuid DEFAULT NULL, p_overwrite_user_id uuid DEFAULT NULL, p_overwrite_org_id uuid DEFAULT NULL)
    RETURNS SETOF data.organization_members
    AS $$
DECLARE
    _new_user_id uuid;
    _new_org_id uuid;
BEGIN
    IF p_organization_id IS NOT NULL THEN
        -- Check if organization exists
        IF NOT EXISTS (
            SELECT
                1
            FROM
                data.organizations
            WHERE
                data.organizations.id = p_organization_id) THEN
        -- If organization does not exist we need to raise an exception and return
        RAISE EXCEPTION 'Error: Organization: % does not exist', p_organization_id;
    ELSE
        -- If the org does exist we set the new org id for the user to the existing orgs id
        _new_org_id := p_organization_id;
    END IF;
END IF;
    -- Create the new user
    IF p_overwrite_user_id IS NULL THEN
        INSERT INTO data.users(id)
            VALUES (DEFAULT)
        RETURNING
            data.users.id INTO _new_user_id;
    ELSE
        INSERT INTO data.users(id)
            VALUES (p_overwrite_user_id)
        RETURNING
            data.users.id INTO _new_user_id;
    END IF;
    RAISE NOTICE '_new_user_id(%)', _new_user_id;
    -- If we don't have an org id we need to create a new org with the new user as the owner
    IF _new_org_id IS NULL THEN
        IF p_overwrite_org_id IS NULL THEN
            INSERT INTO data.organizations(user_id_owner)
                VALUES (_new_user_id)
            RETURNING
                data.organizations.id INTO _new_org_id;
        ELSE
            INSERT INTO data.organizations(id, user_id_owner)
                VALUES (p_overwrite_org_id, _new_user_id)
            RETURNING
                data.organizations.id INTO _new_org_id;
        END IF;
    END IF;
    RAISE NOTICE '_new_org_id(%)', _new_org_id;
    -- Now we can create an entry in organization_members with the user and organization id
    RETURN QUERY INSERT INTO data.organization_members(user_id, organization_id)
        VALUES (_new_user_id, _new_org_id)
    RETURNING
        *;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.update_user_orgs(p_user_id uuid, p_organization_id uuid)
    RETURNS SETOF data.organization_members
    AS $$
DECLARE
    _new_user_id uuid;
    _new_org_id uuid;
BEGIN
    -- Check if user exists
    IF NOT EXISTS (
        SELECT
            1
        FROM
            data.users
        WHERE
            data.users.id = p_user_id) THEN
    -- If organization does not exist we need to raise an exception and return
    RAISE EXCEPTION 'Error: User: % does not exist', p_user_id;
END IF;
    -- Check if organization exists
    IF NOT EXISTS (
        SELECT
            1
        FROM
            data.organizations
        WHERE
            data.organizations.id = p_organization_id) THEN
    -- If organization does not exist we need to raise an exception and return
    RAISE EXCEPTION 'Error: Organization: % does not exist', p_organization_id;
END IF;
    -- create an entry in organization_members with the user and organization id
    RETURN QUERY INSERT INTO data.organization_members(user_id, organization_id)
        VALUES (p_user_id, p_organization_id)
    RETURNING
        *;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.get_user_organizations()
    RETURNS TABLE(
        user_id uuid,
        organization_ids uuid[]
    )
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        om.user_id,
        array_agg(om.organization_id) AS organization_ids
    FROM
        data.organization_members om
    GROUP BY
        om.user_id;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.get_user_organization_info(p_user_id uuid)
    RETURNS SETOF data.organization_members
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        *
    FROM
        data.organization_members om
    WHERE
        om.user_id = p_user_id;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.get_organizations()
    RETURNS TABLE(
        organization_id uuid,
        owner_id uuid,
        user_ids uuid[]
    )
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        o.id AS organization_id,
        o.user_id_owner AS owner_id,
        array_agg(om.user_id) AS members_ids
    FROM
        data.organization_members om
        JOIN data.organizations o ON om.organization_id = o.id
    GROUP BY
        o.id,
        o.user_id_owner;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.get_organization_users(p_organization_id uuid)
    RETURNS SETOF data.organization_members
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        *
    FROM
        data.organization_members om
    WHERE
        om.organization_id = p_organization_id;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.get_organization(p_organization_id uuid)
    RETURNS TABLE(
        organization_id uuid,
        owner_id uuid,
        user_ids uuid[]
    )
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        o.id,
        o.user_id_owner AS owner_id,
        array_agg(om.user_id) AS members_ids
    FROM
        data.organization_members om
        JOIN data.organizations o ON om.organization_id = o.id
    WHERE
        o.id = p_organization_id
    GROUP BY
        o.id,
        o.user_id_owner;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.get_user_conversations(p_user_id uuid, p_organization_id uuid DEFAULT NULL, p_bot_id uuid DEFAULT NULL)
    RETURNS SETOF data.conversations
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.*
    FROM
        data.conversations c
    WHERE(p_user_id IS NULL
        OR c.user_id = p_user_id)
        AND(p_organization_id IS NULL
            OR p_organization_id = c.organization_id)
        AND(p_bot_id IS NULL
            OR p_bot_id = c.bot_id)
    ORDER BY
        c.updated_at DESC;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.get_user_conversation(p_user_id uuid, p_conversation_id uuid)
    RETURNS SETOF data.conversations
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.*
    FROM
        data.conversations c
    WHERE
        c.user_id = p_user_id
        AND c.id = p_conversation_id;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.create_conversation(p_user_id uuid, p_organization_id uuid DEFAULT NULL, p_bot_id uuid DEFAULT NULL, p_overwrite_id uuid DEFAULT NULL)
    RETURNS SETOF data.conversations
    AS $$
BEGIN
    IF p_overwrite_id IS NULL THEN
        RETURN QUERY INSERT INTO data.conversations(user_id, organization_id, bot_id)
            VALUES(p_user_id, p_organization_id, p_bot_id)
        RETURNING
            *;
    ELSE
        RETURN QUERY INSERT INTO data.conversations(id, user_id, organization_id, bot_id)
            VALUES(p_overwrite_id, p_user_id, p_organization_id, p_bot_id)
        RETURNING
            *;
    END IF;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.get_user_messages(p_user_id uuid, p_conversation_id uuid, p_num_messages integer DEFAULT NULL)
    RETURNS SETOF data.messages
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.*
    FROM
        data.messages m
    WHERE
        m.user_id = p_user_id
        AND m.conversation_id = p_conversation_id
    ORDER BY
        m.message_index ASC
    LIMIT p_num_messages;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.get_bots(p_organization_id uuid)
    RETURNS SETOF data.bots
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.*
    FROM
        data.bots b
    WHERE
        b.organization_id = p_organization_id
    ORDER BY
        b.updated_at DESC;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.get_bot(p_bot_id uuid, p_organization_id uuid)
    RETURNS SETOF data.bots
    AS $$
DECLARE
    result data.bots;
BEGIN
    RETURN QUERY
    SELECT
        b.*
    FROM
        data.bots b
    WHERE
        b.organization_id = p_organization_id
        AND b.id = p_bot_id;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION data.create_message(p_user_id uuid, p_organization_id uuid, p_bot_id uuid, p_conversation_id uuid, p_message_type varchar, p_message_content text, p_message_content_embedding_jina_v2_base_en extensions.vector)
    RETURNS SETOF data.messages
    AS $$
DECLARE
    -- Variable to hold the next message_index for the new message
    _next_message_index bigint;
BEGIN
    -- Calculate the next message_index for the new message in the conversation
    SELECT
        COALESCE(MAX(data.messages.message_index), 0) + 1 INTO _next_message_index
    FROM
        data.messages
    WHERE
        data.messages.user_id = p_user_id
        AND data.messages.conversation_id = p_conversation_id;
    RAISE NOTICE '_next_message_index(%)', _next_message_index;
    -- Insert the new message into the table
    RETURN QUERY INSERT INTO data.messages(user_id, organization_id, bot_id, conversation_id, message_type, message_index, message_content, message_content_embedding_jina_v2_base_en)
        VALUES (p_user_id, p_organization_id, p_bot_id, p_conversation_id, p_message_type, _next_message_index, p_message_content, p_message_content_embedding_jina_v2_base_en)
    RETURNING
        *;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

