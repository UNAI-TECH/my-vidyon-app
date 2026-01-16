# Quick Fix Guide - Banner Not Showing

## Problem
Event cards show calendar icon instead of uploaded banner image.

## Root Cause
The `banner_url` column doesn't exist in the `academic_events` table, OR the event was created before the banner feature was added.

## Quick Fix (3 Steps)

### Step 1: Add the Column
Open Supabase SQL Editor and run:

```sql
ALTER TABLE academic_events ADD COLUMN IF NOT EXISTS banner_url TEXT;
```

### Step 2: Create Storage Bucket
1. Go to Supabase Dashboard
2. Click **Storage** in sidebar
3. Click **"New bucket"**
4. Enter details:
   - **Name:** `event-banners`
   - **Public:** ✅ (checked)
   - **File size limit:** `5242880`
5. Click **"Create bucket"**

### Step 3: Test with New Event
1. Go to Institution Calendar
2. Click **"Add Event"**
3. Fill in all fields
4. **Upload an image** (JPG, PNG, < 5MB)
5. Click **"Save Event"**
6. **Banner should now display!**

---

## Why Old Events Don't Have Banners

Events created **before** adding the `banner_url` column will have `NULL` in that field, so they show the calendar icon.

**Solution:** Edit old events and upload banners for them.

---

## Verify It's Working

Run this SQL query:

```sql
SELECT id, title, banner_url, created_at
FROM academic_events
ORDER BY created_at DESC
LIMIT 5;
```

**What to look for:**
- ✅ New events should have `banner_url` with a URL
- ❌ Old events will have `banner_url` as `NULL`

---

## Test the Banner URL

1. Copy a `banner_url` from the database
2. Paste it in your browser
3. **Expected:** Image loads
4. **If 404:** File doesn't exist (upload failed)
5. **If 403:** Storage policies missing

---

## Full Setup Script

For complete setup including storage policies, run:

```bash
supabase/fix_banner_issues.sql
```

This will:
- ✅ Add `banner_url` column
- ✅ Check storage bucket
- ✅ Create storage policies
- ✅ Verify setup

---

## Still Not Working?

1. **Check browser console** (F12) for errors
2. **Check Supabase logs** for upload errors
3. **Try a different image** (smaller file, different format)
4. **Clear browser cache** (Ctrl+Shift+R)

---

## Delete Confirmation Dialog

✅ **FIXED!** Delete now shows confirmation dialog:
1. Click delete icon
2. Confirmation popup appears
3. Click "Delete Event" to confirm
4. Event deleted and syncs to all portals

---

## Summary

**Two issues fixed:**

1. ✅ **Delete Confirmation** - Now shows popup before deleting
2. 🔧 **Banner Display** - Requires database setup:
   - Add `banner_url` column (SQL command above)
   - Create `event-banners` bucket (Supabase Dashboard)
   - Upload banners to new events

**Note:** Old events won't have banners until you edit them and upload images.
