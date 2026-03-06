-- ============================================
-- Hubaab Studios — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROJECTS TABLE (Portfolio Work)
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  client TEXT,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'Cinematic',
  description TEXT,
  services TEXT,
  thumbnail_url TEXT,
  media_urls TEXT[] DEFAULT '{}',
  video_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NEWS TABLE (Blog / News Posts)
-- ============================================
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CAREERS TABLE (Open Roles)
-- ============================================
CREATE TABLE IF NOT EXISTS careers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'Freelance / Contract',
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INQUIRIES TABLE (Contact Form Submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  -- Step 1: About You
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  -- Step 2: How Can We Help
  services TEXT[] DEFAULT '{}',
  -- Step 3: About Your Business
  company TEXT,
  role TEXT,
  industry TEXT,
  -- Step 4: About Your Project
  project_description TEXT,
  budget TEXT,
  timeline TEXT,
  -- Meta
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Public read access for projects, news, careers
CREATE POLICY "Public read projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Public read news" ON news
  FOR SELECT USING (published = true);

CREATE POLICY "Public read careers" ON careers
  FOR SELECT USING (active = true);

-- Public insert for inquiries (contact form)
CREATE POLICY "Public insert inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

-- Authenticated (admin) full access
CREATE POLICY "Admin full access projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access news" ON news
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access careers" ON careers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access inquiries" ON inquiries
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_careers_updated_at
  BEFORE UPDATE ON careers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STUDIO INFO TABLE (Global Settings)
-- ============================================
CREATE TABLE IF NOT EXISTS studio_info (
  id INTEGER PRIMARY KEY CHECK (id = 1), -- Ensure only one row exists
  intro TEXT,
  services JSONB DEFAULT '[]'::jsonb,
  clients JSONB DEFAULT '[]'::jsonb,
  industry JSONB DEFAULT '[]'::jsonb,
  press JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the single default row if it doesn't exist
INSERT INTO studio_info (id, intro)
VALUES (1, 'Hubaab Studios is a creative video production agency based in Srinagar and New Delhi.')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE studio_info ENABLE ROW LEVEL SECURITY;

-- Public can read studio info
CREATE POLICY "Public read studio_info" ON studio_info
  FOR SELECT USING (true);

-- Admin can update studio info
CREATE POLICY "Admin update studio_info" ON studio_info
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE TRIGGER update_studio_info_updated_at
  BEFORE UPDATE ON studio_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
