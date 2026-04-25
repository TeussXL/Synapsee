CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT := NEW.email;
  v_account_type TEXT := COALESCE(NEW.raw_user_meta_data->>'account_type', 'pessoa');
  v_display_name TEXT := COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(v_email, '@', 1));
  v_handle TEXT := COALESCE(NEW.raw_user_meta_data->>'handle', split_part(v_email, '@', 1));
  v_course TEXT := NEW.raw_user_meta_data->>'course';
  v_semester TEXT := NEW.raw_user_meta_data->>'semester';
  v_domain TEXT := lower(split_part(v_email, '@', 2));
  v_role public.app_role;
BEGIN
  IF v_account_type = 'instituicao' THEN
    v_role := 'instituicao';
  ELSIF v_account_type = 'empresa' THEN
    v_role := 'empresa';
  ELSIF v_domain ~ '(^|\.)prof\.' THEN
    v_role := 'professor';
  ELSE
    v_role := 'aluno';
  END IF;

  INSERT INTO public.profiles (user_id, display_name, handle, email, account_type, course, semester)
  VALUES (NEW.id, v_display_name, v_handle, v_email, v_account_type, v_course, v_semester);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, v_role);

  RETURN NEW;
END;
$$;