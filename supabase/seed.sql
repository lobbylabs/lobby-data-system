DO
  $$
DECLARE
  _organization_id uuid;
  _user_id uuid;
  _bot_id uuid;
BEGIN
  select organization_id, user_id into _organization_id, _user_id from data.create_user(null);
  perform data.create_user(p_organization_id := _organization_id);

  select id into _bot_id from data.create_bot(p_organization_id := _organization_id, p_user_id_owner := _user_id);
END$$;
