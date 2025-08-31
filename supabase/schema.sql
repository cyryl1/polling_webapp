-- Create the 'polls' table
CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL
);

-- Create the 'poll_options' table
CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL
);

-- Create the 'votes' table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE
);

-- Enable Row-Level Security (RLS) for tables
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS policies for 'polls' table
CREATE POLICY "Authenticated users can create polls" ON polls FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "All users can read polls" ON polls FOR SELECT USING (TRUE);

-- RLS policies for 'poll_options' table
CREATE POLICY "All users can read poll options" ON poll_options FOR SELECT USING (TRUE);

-- RLS policies for 'votes' table
CREATE POLICY "Authenticated users can create votes" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "All users can read votes" ON votes FOR SELECT USING (TRUE);