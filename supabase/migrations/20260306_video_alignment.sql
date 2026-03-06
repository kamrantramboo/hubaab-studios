-- Add video_alignment column to projects table
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='video_alignment') THEN
    ALTER TABLE projects ADD COLUMN video_alignment TEXT DEFAULT 'top center';
  END IF;
END $$;
