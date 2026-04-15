CREATE TABLE IF NOT EXISTS pet_nose_profiles (
  id SERIAL PRIMARY KEY,
  pet_id INTEGER NOT NULL UNIQUE,
  images JSONB NOT NULL DEFAULT '[]',
  representative_image_url TEXT,
  quality_score INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nose_verification_logs (
  id SERIAL PRIMARY KEY,
  visit_session_id INTEGER NOT NULL,
  pet_id INTEGER NOT NULL,
  similarity_score INTEGER DEFAULT 0,
  matched BOOLEAN DEFAULT FALSE,
  captured_image_url TEXT,
  fail_reason TEXT,
  manual_approval BOOLEAN DEFAULT FALSE,
  approved_by INTEGER,
  verified_at TIMESTAMP DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pet_visit_sessions' AND column_name = 'nose_verified'
  ) THEN
    ALTER TABLE pet_visit_sessions ADD COLUMN nose_verified BOOLEAN DEFAULT FALSE;
  END IF;
END $$;
