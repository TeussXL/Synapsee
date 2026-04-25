-- Enum de papéis no Sinapse
CREATE TYPE public.app_role AS ENUM ('aluno', 'professor', 'instituicao', 'empresa', 'admin');

-- Tabela de perfis (dados públicos do usuário)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  handle TEXT UNIQUE,
  email TEXT NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'pessoa',
  course TEXT,
  semester TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Perfis são públicos para usuários autenticados (rede social)
CREATE POLICY "Perfis vis\u00edveis para autenticados"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usu\u00e1rio cria seu pr\u00f3prio perfil"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usu\u00e1rio atualiza seu pr\u00f3prio perfil"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tabela de papéis (separada para evitar privilege escalation)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função SECURITY DEFINER para checar papéis sem recursão
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Usu\u00e1rio v\u00ea seus pap\u00e9is"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin gerencia pap\u00e9is"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger automático: cria perfil + papel inicial ao registrar usuário
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
  v_role public.app_role;
BEGIN
  -- Define papel a partir do domínio do e-mail / tipo de conta
  IF v_account_type = 'instituicao' THEN
    v_role := 'instituicao';
  ELSIF v_account_type = 'empresa' THEN
    v_role := 'empresa';
  ELSIF v_email LIKE '%@prof.modulo.edu.br' OR v_email LIKE '%@modulo.edu.br' THEN
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();