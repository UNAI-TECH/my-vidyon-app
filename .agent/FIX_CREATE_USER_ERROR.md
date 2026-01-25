# 🔧 Fix: Create User 400 Error

## Problem
When creating a new student, you're getting this error:
```
Edge Function returned a non-2xx status code (400)
```

## Root Cause
The `is_active` column doesn't exist in your database yet. You need to run the SQL migration that adds this column.

## Solution

### Step 1: Run the SQL Migration
1. Open `SOFT_DELETE_SETUP.html` in your browser
2. Click "Copy SQL"
3. Go to [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor
4. Paste the SQL and click "Run"

This will add the `is_active` column to:
- `students` table
- `parents` table
- `profiles` table

### Step 2: Verify the Migration
After running the SQL, verify it worked:

```sql
-- Check if is_active column exists in students table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'students' AND column_name = 'is_active';

-- Should return: is_active | boolean
```

### Step 3: Test Creating a User
1. Go to Institution Portal → Users
2. Click "Add Student"
3. Fill in the form
4. Click "Create Student"
5. ✅ Should work without errors!

## Why This Happens

The `create-user` edge function tries to set default values for new users, including `is_active = true`. If the column doesn't exist, the database returns a 400 error.

## Quick Fix Summary

**Run this SQL once:**
```sql
-- Add is_active column to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add is_active column to parents table
ALTER TABLE public.parents 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add is_active column to profiles table (for staff)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
```

After running this, the create user functionality will work perfectly!

---

**Status:** Run the SQL migration from `SOFT_DELETE_SETUP.html` to fix this error.
