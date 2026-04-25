CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 3 AND 140),
  body TEXT NOT NULL CHECK (length(body) BETWEEN 3 AND 4000),
  category TEXT NOT NULL DEFAULT 'aviso_geral'
    CHECK (category IN ('academico', 'eventos', 'provas', 'aviso_geral')),
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_announcements_pinned_created ON public.announcements (pinned DESC, created_at DESC);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Todos os autenticados podem ler
CREATE POLICY "Avisos vis\u00edveis para autenticados"
  ON public.announcements FOR SELECT
  TO authenticated
  USING (true);

-- Apenas professores ou admins criam (e como eles mesmos)
CREATE POLICY "Apenas professores criam avisos"
  ON public.announcements FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND (public.has_role(auth.uid(), 'professor') OR public.has_role(auth.uid(), 'admin'))
  );

-- Apenas o autor (sendo professor/admin) edita
CREATE POLICY "Autor professor edita aviso"
  ON public.announcements FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    AND (public.has_role(auth.uid(), 'professor') OR public.has_role(auth.uid(), 'admin'))
  );

-- Apenas o autor (sendo professor/admin) ou admin apaga
CREATE POLICY "Autor ou admin apaga aviso"
  ON public.announcements FOR DELETE
  TO authenticated
  USING (
    (auth.uid() = user_id AND public.has_role(auth.uid(), 'professor'))
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();