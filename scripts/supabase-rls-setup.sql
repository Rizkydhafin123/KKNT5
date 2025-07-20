-- Disable RLS for development (enable later for production)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE umkm DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON users TO anon;
GRANT ALL ON umkm TO anon;
GRANT ALL ON users TO authenticated;
GRANT ALL ON umkm TO authenticated;

-- Enable RLS and create policies (uncomment for production)
/*
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE umkm ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- UMKM policies
CREATE POLICY "Users can view own UMKM" ON umkm
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own UMKM" ON umkm
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own UMKM" ON umkm
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own UMKM" ON umkm
  FOR DELETE USING (auth.uid()::text = user_id::text);
*/
