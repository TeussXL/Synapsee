ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS last_username_change TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_profiles_last_username_change 
ON profiles(last_username_change);