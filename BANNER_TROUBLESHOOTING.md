# Event Banner Troubleshooting Guide

## Issue: Banners Not Displaying (Calendar Icon Shows Instead)

### Quick Diagnosis Steps

#### Step 1: Check if `banner_url` column exists in database

Run this in Supabase SQL Editor:

```sql
-- Check if column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'academic_events' 
AND column_name = 'banner_url';
```

**Expected Result:** Should return one row with:
- column_name: `banner_url`
- data_type: `text`
- is_nullable: `YES`

**If no results:** Run this to add the column:
```sql
ALTER TABLE academic_events ADD COLUMN banner_url TEXT;
```

---

#### Step 2: Check if Storage Bucket exists

```sql
-- Check if bucket exists
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'event-banners';
```

**Expected Result:** Should return one row with:
- id: `event-banners`
- name: `event-banners`
- public: `true`
- file_size_limit: `5242880`

**If no results:** Create the bucket manually:
1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Name: `event-banners`
4. Public: ✅ (checked)
5. File size limit: `5242880`

---

#### Step 3: Check existing events for banner_url

```sql
-- Check if events have banner_url
SELECT id, title, banner_url, created_at
FROM academic_events
ORDER BY created_at DESC
LIMIT 10;
```

**What to look for:**
- If `banner_url` is `NULL` for all events → Banners were never uploaded
- If `banner_url` has values → Check if URLs are accessible

---

#### Step 4: Test banner URL accessibility

If you see a `banner_url` value like:
```
https://abc123.supabase.co/storage/v1/object/public/event-banners/inst-123/1705395802123.jpg
```

1. Copy the URL
2. Paste it in a new browser tab
3. **Expected:** Image should load
4. **If 404 error:** File doesn't exist in storage
5. **If 403 error:** Storage policies are wrong

---

#### Step 5: Check Storage Policies

```sql
-- Check if policies exist
SELECT policyname, cmd, roles, qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
```

**Required policies:**
1. Public can view event banners (SELECT)
2. Institution users can upload (INSERT)
3. Institution users can update (UPDATE)
4. Institution users can delete (DELETE)

**If missing:** Run the setup script:
```sql
-- See: supabase/setup_event_banners_storage.sql
```

---

### Common Issues & Solutions

#### Issue 1: Column doesn't exist
**Symptom:** Events save but no banner_url
**Solution:**
```sql
ALTER TABLE academic_events ADD COLUMN IF NOT EXISTS banner_url TEXT;
```

#### Issue 2: Bucket doesn't exist
**Symptom:** Upload fails with "Bucket not found"
**Solution:** Create bucket in Supabase Dashboard (see Step 2 above)

#### Issue 3: Policies missing
**Symptom:** Upload fails with "Policy violation"
**Solution:** Run `supabase/setup_event_banners_storage.sql`

#### Issue 4: Old events have no banners
**Symptom:** New events show banners, old events don't
**Explanation:** Old events were created before banner feature
**Solution:** Edit old events and upload banners

---

### Testing Upload Functionality

1. **Create a test event:**
   - Go to Institution Calendar
   - Click "Add Event"
   - Fill in all fields
   - **Upload a small image (< 1MB)**
   - Click "Save Event"

2. **Check database:**
```sql
SELECT id, title, banner_url 
FROM academic_events 
ORDER BY created_at DESC 
LIMIT 1;
```

3. **Verify banner_url:**
   - Should NOT be NULL
   - Should start with `https://`
   - Should contain `/event-banners/`

4. **Test URL:**
   - Copy the banner_url
   - Open in browser
   - Image should load

---

### Browser Console Debugging

Open browser DevTools (F12) and check:

1. **Console tab:**
   - Look for errors like:
     - "Failed to fetch"
     - "404 Not Found"
     - "403 Forbidden"
     - "CORS error"

2. **Network tab:**
   - Filter by "Img"
   - Look for failed image requests
   - Check the URL being requested

3. **Application tab → Storage:**
   - Check if Supabase is storing data correctly

---

### Realtime Sync Verification

1. **Open calendar in 2 browser tabs**
2. **In Tab 1:** Create event with banner
3. **In Tab 2:** Should see:
   - Toast notification "Calendar updated"
   - New event appears automatically
   - Banner displays (if upload successful)

---

### Quick Fix Checklist

Run these in order:

```sql
-- 1. Add column if missing
ALTER TABLE academic_events ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- 2. Verify column exists
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'academic_events' AND column_name = 'banner_url';

-- 3. Check bucket
SELECT * FROM storage.buckets WHERE id = 'event-banners';

-- 4. If bucket missing, create it via Dashboard or SQL
-- (See setup_event_banners_storage.sql)

-- 5. Test with a new event
-- Upload a banner and check if banner_url is populated
```

---

### Still Not Working?

1. **Check Supabase logs:**
   - Dashboard → Logs
   - Look for errors during upload

2. **Verify file size:**
   - Must be < 5MB
   - Supported formats: JPG, PNG, GIF, WebP

3. **Check browser console:**
   - Any JavaScript errors?
   - Network errors?

4. **Test with different image:**
   - Try a very small image (< 100KB)
   - Try different format (JPG vs PNG)

5. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

### Success Indicators

✅ **Everything is working when:**
1. `banner_url` column exists in database
2. `event-banners` bucket exists and is public
3. New events have `banner_url` populated
4. Banner URLs are accessible in browser
5. Banners display in all portals (Institution/Faculty/Student/Parent)
6. Realtime updates work across tabs

---

### Need Help?

If banners still don't show after following this guide:

1. Check the database query results
2. Verify the banner_url value
3. Test the URL in browser
4. Check browser console for errors
5. Review Supabase logs

The issue is usually one of:
- Missing `banner_url` column
- Missing storage bucket
- Missing storage policies
- Old events created before banner feature
