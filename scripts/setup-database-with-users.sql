-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  rw VARCHAR(2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update UMKM table to include user_id
ALTER TABLE umkm ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_umkm_user_id ON umkm(user_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Enable Row Level Security (RLS) for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Update RLS policy for UMKM table
DROP POLICY IF EXISTS "Allow all operations on umkm" ON umkm;

-- Admin can see all data, users can only see their own data
CREATE POLICY "Admin can see all UMKM data" ON umkm
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can see their own UMKM data" ON umkm
  FOR ALL USING (user_id::text = auth.uid()::text);

-- Insert admin user (if using Supabase Auth, this would be handled differently)
INSERT INTO users (id, username, name, role, rw) 
VALUES ('admin-001', 'admin', 'Ketua RW 05', 'admin', '05')
ON CONFLICT (username) DO NOTHING;
