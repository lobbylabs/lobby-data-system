DO $$
DECLARE
  _organization_id uuid := '00000000-0000-4000-8000-00000000acea';
  _user_id uuid := '00000000-0000-4000-8000-00000000baeb';
  _bot_id uuid := '00000000-0000-4000-8000-00000000b0b0';
  _conversation_id uuid := '00000000-0000-4000-8000-00000000c0fa';
  _conversation_id_2 uuid := '10000000-0000-4000-8000-00000000c0fa';
BEGIN
  PERFORM
    data.create_user(p_overwrite_user_id := _user_id, p_overwrite_org_id := _organization_id);
  PERFORM
    data.create_bot(p_organization_id := _organization_id, p_user_id_owner := _user_id, p_overwrite_id := _bot_id, p_system_prompt := 'you are a helpful assistant that uses the provided context to answer questions. If the context doesnt contain an answer to the question, tell the user you dont know');
  PERFORM
    data.create_conversation(p_user_id := _user_id, p_organization_id := _organization_id, p_bot_id := _bot_id, p_overwrite_id := _conversation_id);
  PERFORM
    data.create_conversation(p_user_id := _user_id, p_overwrite_id := _conversation_id_2);
END
$$;

