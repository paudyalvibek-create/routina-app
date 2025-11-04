CREATE TABLE preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50),
    timezone VARCHAR(100),
    wake_time TIME,
    sleep_time TIME,
    goals JSONB DEFAULT '[]',
    constraints_list JSONB DEFAULT '[]',
    focus_areas JSONB DEFAULT '[]',
    routine_types JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);