-- Migration to create studio_info table for dynamic about content
CREATE TABLE IF NOT EXISTS studio_info (
  id BIGINT PRIMARY KEY DEFAULT 1,
  intro TEXT NOT NULL,
  services JSONB DEFAULT '[]'::jsonb,
  clients JSONB DEFAULT '[]'::jsonb,
  industry JSONB DEFAULT '[]'::jsonb,
  press JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert a default record if it doesn't exist
INSERT INTO studio_info (id, intro, services, clients, industry, press)
VALUES (1, 
  'hubaab studio is a cinematic production studio working across film, commercial, music, and fashion. We have a passion for creating beautiful work rooted in storytelling, brought to life through thoughtful collaboration, craft, and end-to-end creative, production, and post-production services.',
  '[{"title": "Creative", "desc": "We work with brands and agencies to develop creative rooted in storytelling."}, {"title": "Production", "desc": "We serve as a full-service production partner for image and motion projects."}, {"title": "Post-Production", "desc": "We offer full post-production and finishing services including editing, color, VFX, sound, and music."}]'::jsonb,
  '[]'::jsonb,
  '["Cinematic", "Commercial", "Branded Content", "Music", "Fashion", "Editorial", "Film", "Documentary"]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE studio_info ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access for studio_info"
ON studio_info FOR SELECT
TO public
USING (true);

-- Create policy for authenticated update access
CREATE POLICY "Authenticated update access for studio_info"
ON studio_info FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
