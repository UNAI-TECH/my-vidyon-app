CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    institution_id TEXT NOT NULL REFERENCES public.institutions(institution_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Attendance', 'Performance', 'Financial', etc.
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'failed'
    url TEXT -- URL to the file in storage (optional for now)
);
