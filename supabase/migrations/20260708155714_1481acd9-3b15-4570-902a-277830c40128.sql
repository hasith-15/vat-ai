
CREATE TABLE public.languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  headline TEXT NOT NULL DEFAULT 'Don''t Do Business in Wrong way, Do it in Smarter Way.',
  button_text TEXT NOT NULL DEFAULT 'Book A Demo Call With Ai',
  image_url TEXT,
  audio_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.languages TO anon, authenticated;
GRANT ALL ON public.languages TO service_role;

ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Languages are publicly readable"
  ON public.languages FOR SELECT
  USING (true);
