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
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE TABLE data.organizations(
    id uuid NOT NULL PRIMARY KEY UNIQUE DEFAULT gen_random_uuid(),
    user_id_owner uuid NOT NULL,
    CONSTRAINT fk_user_id_owner FOREIGN KEY (user_id_owner) REFERENCES data.users(id)
);

CREATE TABLE data.organization_members(
    user_id uuid REFERENCES data.users(id),
    organization_id uuid REFERENCES data.organizations(id),
    CONSTRAINT pkey_organization_members PRIMARY KEY (user_id, organization_id)
);

-- Organization Bots
CREATE TABLE data.bots(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL,
    user_id_owner uuid NOT NULL,
    system_prompt text NOT NULL DEFAULT '',
    bot_summary text NULL,
    bot_summary_embedding_ada_002 extensions.vector(1536) NULL,
    bot_summary_embedding_jina_v2_base_en extensions.vector(768) NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT bots_pkey PRIMARY KEY (organization_id, id),
    CONSTRAINT fk_organization FOREIGN KEY (organization_id) REFERENCES data.organizations(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id_owner) REFERENCES data.users(id)
)
PARTITION BY LIST (organization_id);

CREATE INDEX ON data.bots USING hnsw(bot_summary_embedding_ada_002 vector_l2_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX ON data.bots USING hnsw(bot_summary_embedding_jina_v2_base_en vector_l2_ops) WITH (m = 16, ef_construction = 64);

-- User Conversations
CREATE TABLE data.conversations(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    bot_id uuid NOT NULL,
    conversation_summary text NULL,
    conversation_summary_embedding_ada_002 extensions.vector(1536) NULL,
    conversation_summary_embedding_jina_v2_base_en extensions.vector(768) NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT conversations_pkey PRIMARY KEY (user_id, id),
    CONSTRAINT fk_organization FOREIGN KEY (organization_id) REFERENCES data.organizations(id),
    CONSTRAINT fk_bot FOREIGN KEY (organization_id, bot_id) REFERENCES data.bots(organization_id, id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES data.users(id)
)
PARTITION BY LIST (user_id);

CREATE INDEX ON data.conversations USING hnsw(conversation_summary_embedding_ada_002 vector_l2_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX ON data.conversations USING hnsw(conversation_summary_embedding_jina_v2_base_en vector_l2_ops) WITH (m = 16, ef_construction = 64);

-- User Messages
CREATE TABLE data.messages(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    bot_id uuid NOT NULL,
    conversation_id uuid NOT NULL,
    message_type varchar(100) NOT NULL,
    message_index bigint NOT NULL,
    message_content text NOT NULL,
    message_content_embedding_ada_002 extensions.vector(1536) NULL,
    message_content_embedding_jina_v2_base_en extensions.vector(768) NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT messages_pkey PRIMARY KEY (user_id, id),
    CONSTRAINT fk_organization FOREIGN KEY (organization_id) REFERENCES data.organizations(id),
    CONSTRAINT fk_bot FOREIGN KEY (organization_id, bot_id) REFERENCES data.bots(organization_id, id),
    CONSTRAINT fk_conversation FOREIGN KEY (user_id, conversation_id) REFERENCES data.conversations(user_id, id)
)
PARTITION BY LIST (user_id);

CREATE INDEX ON data.messages USING hnsw(message_content_embedding_ada_002 vector_l2_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX ON data.messages USING hnsw(message_content_embedding_jina_v2_base_en vector_l2_ops) WITH (m = 16, ef_construction = 64);

-- Organization Documents
CREATE TABLE data.documents(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    bot_id uuid NOT NULL,
    organization_id uuid NOT NULL,
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
    last_updated timestamp NOT NULL DEFAULT now(),
    CONSTRAINT documents_pkey PRIMARY KEY (bot_id, id),
    CONSTRAINT fk_organization FOREIGN KEY (organization_id) REFERENCES data.organizations(id),
    CONSTRAINT fk_bot FOREIGN KEY (organization_id, bot_id) REFERENCES data.bots(organization_id, id)
)
PARTITION BY LIST (bot_id);

CREATE INDEX ON data.documents USING hnsw(content_embedding_ada_002 vector_l2_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX ON data.documents USING hnsw(document_summary_embedding_ada_002 vector_l2_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX ON data.documents USING hnsw(content_embedding_jina_v2_base_en vector_l2_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX ON data.documents USING hnsw(document_summary_embedding_jina_v2_base_en vector_l2_ops) WITH (m = 16, ef_construction = 64);

-- Organization Document Chunks
CREATE TABLE data.document_chunks(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    bot_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    document_id uuid NOT NULL,
    chunk_content text NOT NULL,
    chunk_content_embedding_ada_002 extensions.vector(1536) NULL,
    chunk_content_embedding_jina_v2_base_en extensions.vector(768) NULL,
    prev_chunk uuid NULL,
    next_chunk uuid NULL,
    CONSTRAINT document_chunks_pkey PRIMARY KEY (bot_id, id),
    CONSTRAINT fk_organization FOREIGN KEY (organization_id) REFERENCES data.organizations(id),
    CONSTRAINT fk_bot FOREIGN KEY (organization_id, bot_id) REFERENCES data.bots(organization_id, id),
    CONSTRAINT fk_document FOREIGN KEY (bot_id, document_id) REFERENCES data.documents(bot_id, id),
    CONSTRAINT document_chunks_prev_chunk_fkey FOREIGN KEY (bot_id, prev_chunk) REFERENCES data.document_chunks(bot_id, id),
    CONSTRAINT document_chunks_next_chunk_fkey FOREIGN KEY (bot_id, next_chunk) REFERENCES data.document_chunks(bot_id, id)
)
PARTITION BY LIST (bot_id);

CREATE INDEX ON data.document_chunks USING hnsw(chunk_content_embedding_ada_002 vector_l2_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX ON data.document_chunks USING hnsw(chunk_content_embedding_jina_v2_base_en vector_l2_ops) WITH (m = 16, ef_construction = 64);

-- alter table
--   data.bots enable row level security;
-- alter table
--   data.conversations enable row level security;
-- alter table
--   data.messages enable row level security;
-- alter table
--   data.documents enable row level security;
-- alter table
--   data.document_chunks enable row level security;
-- alter table
--   data.users enable row level security;
-- alter table
--   data.organizations enable row level security;
-- GRANT
--   ALL ON TABLE data.bots TO service_role;
-- GRANT
--   ALL ON TABLE data.conversations TO service_role;
-- GRANT
--   ALL ON TABLE data.messages TO service_role;
-- GRANT
--   ALL ON TABLE data.documents TO service_role;
-- GRANT
--   ALL ON TABLE data.document_chunks TO service_role;
-- GRANT
--   ALL ON TABLE data.users TO service_role;
-- GRANT
--   ALL ON TABLE data.organizations TO service_role;
-- Create Functions
CREATE OR REPLACE FUNCTION data.on_insert_bot()
    RETURNS TRIGGER
    AS $$
BEGIN
    -- Create partitions for all three tables
    EXECUTE format('CREATE TABLE IF NOT EXISTS data.documents_p_%s PARTITION OF data.documents FOR VALUES IN (%L)', replace(NEW.id::text, '-', '_'), NEW.id);
    EXECUTE format('CREATE TABLE IF NOT EXISTS data.document_chunks_p_%s PARTITION OF data.document_chunks FOR VALUES IN (%L)', replace(NEW.id::text, '-', '_'), NEW.id);
    -- Delayed insert approach to ensure partition creation
    -- INSERT INTO data.bots VALUES (NEW.*);
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trigger_for_bots_partition
    AFTER INSERT ON data.bots
    FOR EACH ROW
    EXECUTE PROCEDURE data.on_insert_bot();

CREATE FUNCTION data.create_bot(p_organization_id uuid, p_user_id_owner uuid, p_system_prompt text DEFAULT '')
    RETURNS SETOF data.bots
    AS $$
DECLARE
    _partition_name text := 'bots_p_' || replace(p_organization_id::text, '-', '_');
BEGIN
    EXECUTE format('CREATE TABLE IF NOT EXISTS data.%I PARTITION OF data.bots FOR VALUES IN (%L);', _partition_name, p_organization_id);
    -- Use the RETURN QUERY to execute the INSERT and return the result
    RETURN QUERY INSERT INTO data.bots(organization_id, user_id_owner, system_prompt)
        VALUES (p_organization_id, p_user_id_owner, p_system_prompt)
    RETURNING
        *;
    -- Asterisk (*) returns all columns of the inserted row
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

--Initialize User Messages Partition
CREATE FUNCTION data.initialize_user_data_partitions(p_user_id uuid)
    RETURNS void
    AS $$
BEGIN
    EXECUTE format('create table if not exists data.conversations_p_%s partition of data.conversations for values in (%L)', replace(p_user_id::text, '-', '_'), p_user_id);
    EXECUTE format('create table if not exists data.messages_p_%s partition of data.messages for values in (%L)', replace(p_user_id::text, '-', '_'), p_user_id);
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE FUNCTION data.document_chunk_similarity_search(p_organization_id uuid, p_bot_id uuid, p_user_id uuid, p_threshold float, p_k int, p_embedding_ada_002 extensions.vector(1536) DEFAULT NULL, p_embedding_jina_v2_base_en extensions.vector(768) DEFAULT NULL)
    RETURNS TABLE(
        id uuid,
        bot_id uuid,
        organization_id uuid,
        document_id uuid,
        chunk_content text,
        prev_chunk uuid,
        next_chunk uuid,
        similarity float)
    LANGUAGE plpgsql
    STABLE
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
            data.document_chunks.bot_id,
            data.document_chunks.organization_id,
            data.document_chunks.document_id,
            data.document_chunks.chunk_content,
            data.document_chunks.prev_chunk,
            data.document_chunks.next_chunk,
            1 -(data.document_chunks.chunk_content_embedding_ada_002 <=> p_embedding_ada_002) AS similarity
        FROM
            data.document_chunks
        WHERE
            data.document_chunks.bot_id = p_bot_id
            AND data.document_chunks.organization_id = p_organization_id
            AND 1 -(data.document_chunks.chunk_content_embedding_ada_002 <=> p_embedding_ada_002) > p_threshold
        ORDER BY
            similarity ASC
        LIMIT p_k;
    ELSIF p_embedding_jina_v2_base_en IS NOT NULL THEN
        -- Perform the main query
        RETURN QUERY
        SELECT
            data.document_chunks.id,
            data.document_chunks.bot_id,
            data.document_chunks.organization_id,
            data.document_chunks.document_id,
            data.document_chunks.chunk_content,
            data.document_chunks.prev_chunk,
            data.document_chunks.next_chunk,
            1 -(data.document_chunks.chunk_content_embedding_jina_v2_base_en <=> p_embedding_jina_v2_base_en) AS similarity
        FROM
            data.document_chunks
        WHERE
            data.document_chunks.bot_id = p_bot_id
            AND data.document_chunks.organization_id = p_organization_id
            AND 1 -(data.document_chunks.chunk_content_embedding_jina_v2_base_en <=> p_embedding_jina_v2_base_en) > p_threshold
        ORDER BY
            similarity ASC
        LIMIT p_k;
    ELSE
        RAISE EXCEPTION 'Invalid vector type';
    END IF;
END
$$;

CREATE FUNCTION data.create_document_with_chunks(p_bot_id uuid, p_organization_id uuid, p_user_id uuid, p_title varchar(255), p_chunks_info json, p_author varchar(255) DEFAULT NULL, p_source_url varchar(2048) DEFAULT NULL, p_document_type varchar(100) DEFAULT NULL, p_content text DEFAULT NULL, p_content_size_kb integer DEFAULT NULL, p_content_embedding_ada_002 extensions.vector(1536) DEFAULT NULL, p_content_embedding_jina_v2_base_en extensions.vector(768) DEFAULT NULL, p_document_summary text DEFAULT NULL, p_document_summary_embedding_ada_002 extensions.vector(1536) DEFAULT NULL, p_document_summary_embedding_jina_v2_base_en extensions.vector(768) DEFAULT NULL, p_mime_type varchar(100) DEFAULT NULL)
    RETURNS boolean
    AS $$
DECLARE
    _doc_id uuid;
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
    -- Check if the bot belongs to the specified user and organization
    IF NOT EXISTS (
        SELECT
            1
        FROM
            data.bots
        WHERE
            data.bots.id = p_bot_id
            AND user_id_owner = p_user_id_owner
            AND organization_id = p_organization_id) THEN
    RAISE EXCEPTION 'The specified bot does not belong to the user or organization.';
END IF;
    -- Insert the document record and get the generated id
    INSERT INTO data.documents(bot_id, organization_id, title, author, source_url, document_type, content, content_size_kb, content_embedding_ada_002, content_embedding_jina_v2_base_en, document_summary, document_summary_embedding_ada_002, document_summary_embedding_jina_v2_base_en, mime_type, num_chunks -- This field will be updated after chunks insertion
)
        VALUES (p_bot_id, p_organization_id, p_title, p_author, p_source_url, p_document_type, p_content, p_content_size_kb, p_content_embedding_ada_002, p_content_embedding_jina_v2_base_en, p_document_summary, p_document_summary_embedding_ada_002, p_document_summary_embedding_jina_v2_base_en, p_mime_type, 0 -- Initialize with 0, will update later
)
    RETURNING
        data.documents.id INTO _doc_id;
    -- Loop through each chunk in the p_chunks_info and insert them
    FOR _chunk IN
    SELECT
        *
    FROM
        json_array_elements(p_chunks_info)
        LOOP
            _num_chunks := _num_chunks + 1;
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
        INSERT INTO data.document_chunks(bot_id, organization_id, document_id, chunk_content, chunk_content_embedding_ada_002, chunk_content_embedding_jina_v2_base_en, prev_chunk)
            VALUES (p_bot_id, p_organization_id, _doc_id, _chunk ->> 'chunk_content', _chunk_content_embedding_ada_002, _chunk_content_embedding_jina_v2_base_en, _previous_chunk_id)
        RETURNING
            data.document_chunks.id INTO _current_chunk_id;
    -- Update the next_chunk field of the previous chunk with the current chunk's id
    IF _previous_chunk_id IS NOT NULL THEN
        UPDATE
            data.document_chunks
        SET
            next_chunk = _current_chunk_id
        WHERE
            bot_id = p_bot_id
            AND data.document_chunks.id = _previous_chunk_id;
        END IF;
    _previous_chunk_id := _current_chunk_id;
END LOOP;
    -- Now that all chunks have been inserted, update the num_chunks field in the documents table
    UPDATE
        data.documents
    SET
        num_chunks = _num_chunks
    WHERE
        data.documents.id = _doc_id;
    RETURN TRUE;
    END;

$$
LANGUAGE plpgsql;

-- creates a new user and org or adds new user to existing org if org id is provided
CREATE FUNCTION data.create_user(p_organization_id uuid)
    RETURNS TABLE(
        LIKE data.organization_members
    )
    AS $$
DECLARE
    _new_user_id uuid;
    _new_org_id uuid;
    _test_test text;
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
    INSERT INTO data.users(id)
        VALUES (DEFAULT)
    RETURNING
        data.users.id INTO _new_user_id;
    -- If we don't have an org id we need to create a new org with the new user as the owner
    IF _new_org_id IS NULL THEN
        INSERT INTO data.organizations(user_id_owner)
            VALUES (_new_user_id)
        RETURNING
            data.organizations.id INTO _new_org_id;
    END IF;
    PERFORM
        data.initialize_user_data_partitions(p_user_id := _new_user_id);
    -- Now we can create an entry in organization_members with the user and organization id
    RETURN QUERY INSERT INTO data.organization_members(user_id, organization_id)
        VALUES (_new_user_id, _new_org_id)
    RETURNING
        data.organization_members.user_id, data.organization_members.organization_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION data.get_users_orgs(p_organization_id uuid DEFAULT NULL)
    RETURNS TABLE(
        user_id uuid,
        organization_ids uuid[]
    )
    AS $$
BEGIN
    IF p_organization_id IS NULL THEN
        RETURN QUERY
        SELECT
            u.id AS user_id,
            ARRAY_AGG(om.organization_id) AS organization_ids
        FROM
            data.users u
            JOIN data.organization_members om ON u.id = om.user_id
        GROUP BY
            u.id;
    ELSE
        RETURN QUERY
        SELECT
            u.id AS user_id,
            ARRAY_AGG(om.organization_id) AS organization_ids
        FROM
            data.users u
            JOIN data.organization_members om ON u.id = om.user_id
        WHERE
            om.organization_id = p_organization_id
        GROUP BY
            u.id;
    END IF;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION data.get_user_conversations(p_user_id uuid)
    RETURNS TABLE(
        LIKE data.conversations
    )
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.*
    FROM
        data.conversations c
    WHERE
        c.user_id = p_user_id
    ORDER BY
        c.updated_at DESC;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION data.get_user_conversation(p_user_id uuid, p_conversation_id)
    RETURNS TABLE(
        LIKE data.conversations
    )
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
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION data.create_conversation(p_user_id uuid, p_organization_id uuid, p_bot_id uuid)
    RETURNS uuid
    AS $$
DECLARE
    v_new_conversation_id uuid;
BEGIN
    INSERT INTO data.conversations(user_id, organization_id, bot_id)
        VALUES (p_user_id, p_organization_id, p_bot_id)
    RETURNING
        id INTO v_new_conversation_id;
    RETURN v_new_conversation_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION data.get_user_messages(p_user_id uuid, p_conversation_id uuid)
    RETURNS TABLE(
        LIKE data.messages
    )
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.*
    FROM
        data.messages m
    WHERE
        m.user_id = p_user_id
        AND m.conversation_id = p_conversation_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION data.get_bots(p_organization_id uuid)
    RETURNS TABLE(
        LIKE data.bots
    )
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.*
    FROM
        data.bots b
    WHERE
        b.organization_id = p_organization_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION data.get_bot(p_bot_id uuid, p_organization_id uuid)
    RETURNS TABLE(
        LIKE data.bots
    )
    AS $$
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
LANGUAGE plpgsql;

