# Event Banners Storage Setup Guide

This guide explains how to set up the Supabase Storage bucket for event banner uploads in the Academic Calendar system.

## 📋 Overview

The event banners feature allows institution administrators to upload image banners when creating calendar events. These banners are displayed across all portals (Faculty, Student, Parent) in realtime.

## 🗄️ Database Structure

### Storage Bucket
- **Bucket Name:** `event-banners`
- **Access:** Public (read-only for everyone, write for institutions)
- **File Size Limit:** 5MB per file
- **Allowed Types:** JPEG, JPG, PNG, GIF, WebP

### Database Column
- **Table:** `academic_events`
- **Column:** `banner_url` (TEXT, nullable)
- **Purpose:** Stores the public URL of uploaded banner images

## 🚀 Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended)

#### Step 1: Create Storage Bucket
1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Enter the following details:
   - **Name:** `event-banners`
   - **Public bucket:** ✅ Enable (checked)
   - **File size limit:** `5242880` (5MB)
   - **Allowed MIME types:** 
     - `image/jpeg`
     - `image/jpg`
     - `image/png`
     - `image/gif`
     - `image/webp`
5. Click **"Create bucket"**

#### Step 2: Set Up Storage Policies
1. Click on the `event-banners` bucket
2. Go to **"Policies"** tab
3. Click **"New policy"**
4. Create the following policies:

**Policy 1: Public Read Access**
```sql
CREATE POLICY "Public can view event banners"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-banners');
```

**Policy 2: Institution Upload Access**
```sql
CREATE POLICY "Institution users can upload event banners"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event-banners' AND
  (auth.jwt() ->> 'role')::text = 'institution'
);
```

**Policy 3: Institution Update Access**
```sql
CREATE POLICY "Institution users can update their event banners"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'event-banners' AND
  (auth.jwt() ->> 'role')::text = 'institution'
);
```

**Policy 4: Institution Delete Access**
```sql
CREATE POLICY "Institution users can delete their event banners"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'event-banners' AND
  (auth.jwt() ->> 'role')::text = 'institution'
);
```

#### Step 3: Add Database Column
1. Go to **SQL Editor** in Supabase dashboard
2. Run the following SQL:

```sql
-- Add banner_url column to academic_events table
ALTER TABLE academic_events ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Add comment
COMMENT ON COLUMN academic_events.banner_url IS 'Public URL of the event banner image';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_academic_events_banner_url 
ON academic_events(banner_url) 
WHERE banner_url IS NOT NULL;
```

### Option 2: Using SQL Script (Automated)

1. Go to **SQL Editor** in Supabase dashboard
2. Open the file: `supabase/setup_event_banners_storage.sql`
3. Copy the entire contents
4. Paste into SQL Editor
5. Click **"Run"**

This will automatically:
- ✅ Create the `event-banners` bucket
- ✅ Set up all necessary RLS policies
- ✅ Add the `banner_url` column to `academic_events` table
- ✅ Create performance index

## ✅ Verification

After setup, verify everything is working:

### Check Bucket Creation
```sql
SELECT * FROM storage.buckets WHERE id = 'event-banners';
```

Expected result:
```
id: event-banners
name: event-banners
public: true
file_size_limit: 5242880
allowed_mime_types: {image/jpeg, image/jpg, image/png, image/gif, image/webp}
```

### Check Database Column
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'academic_events' AND column_name = 'banner_url';
```

Expected result:
```
column_name: banner_url
data_type: text
is_nullable: YES
```

### Check Policies
```sql
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%event banner%';
```

Expected result: 4 policies listed

## 📁 File Storage Structure

Uploaded banners are organized as:
```
event-banners/
  ├── {institution_id_1}/
  │   ├── 1705395802123.jpg
  │   ├── 1705395902456.png
  │   └── ...
  ├── {institution_id_2}/
  │   ├── 1705396002789.jpg
  │   └── ...
  └── ...
```

## 🔒 Security

- **Public Read:** Anyone can view banners (needed for Faculty/Student/Parent portals)
- **Restricted Write:** Only authenticated institution users can upload
- **Institution Isolation:** Files are organized by institution ID
- **File Validation:** Only image files up to 5MB are accepted
- **RLS Policies:** Supabase Row Level Security ensures proper access control

## 🎯 Usage in Application

Once set up, the application will:

1. **Institution creates event with banner:**
   - Uploads image to `event-banners/{institutionId}/{timestamp}.{ext}`
   - Gets public URL from Supabase Storage
   - Saves URL to `academic_events.banner_url`

2. **All portals display banner:**
   - Faculty Calendar shows banner in event cards
   - Student Calendar shows banner in event cards
   - Parent Calendar shows banner in event cards
   - Institution Calendar shows banner in event cards

3. **Realtime sync:**
   - When institution uploads/updates event
   - All connected users see changes instantly
   - Banners load from CDN for fast performance

## 🐛 Troubleshooting

### Upload fails with "Policy violation"
- Check that the user has `role: 'institution'` in their JWT
- Verify RLS policies are created correctly
- Ensure bucket is public

### Banners don't display
- Check that `banner_url` column exists in database
- Verify the URL is accessible (try opening in browser)
- Check browser console for CORS errors

### "Bucket not found" error
- Verify bucket name is exactly `event-banners`
- Check bucket was created successfully
- Refresh Supabase dashboard

## 📞 Support

If you encounter issues:
1. Check Supabase logs in dashboard
2. Verify all SQL scripts ran successfully
3. Test with a small image file first
4. Check browser network tab for errors

## 🎉 Success!

Once setup is complete, you can:
- ✅ Upload event banners from Institution Calendar
- ✅ View banners in all portals (Faculty/Student/Parent)
- ✅ Enjoy realtime synchronization
- ✅ Have fast CDN-delivered images
