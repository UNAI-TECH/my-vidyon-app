# 🔧 FIX: Storage RLS Error

## ❌ Error:
```
StorageApiError: new row violates row-level security policy
```

## 🎯 Cause:
The `exam-schedules` storage bucket doesn't exist or doesn't have proper RLS policies.

---

## ✅ SOLUTION (2 Minutes)

### **Option 1: Run SQL Script** (Recommended)

1. **Open Supabase Dashboard**
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire content from:
   ```
   supabase/setup_exam_schedules_storage.sql
   ```
5. Click **Run** (or press Ctrl+Enter)
6. ✅ Done! You should see success messages

---

### **Option 2: Manual Setup** (If SQL fails)

#### **Step 1: Create Bucket**

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Fill in:
   - **Name:** `exam-schedules`
   - **Public:** ❌ (UNCHECKED - keep private)
   - **File size limit:** `10485760` (10MB)
   - **Allowed MIME types:**
     ```
     application/pdf
     application/msword
     application/vnd.openxmlformats-officedocument.wordprocessingml.document
     ```
4. Click **Create bucket**

#### **Step 2: Add RLS Policies**

1. Still in **Storage** → Click on `exam-schedules` bucket
2. Go to **Policies** tab
3. Click **New Policy**

**Policy 1: Allow Upload**
```sql
CREATE POLICY "Allow authenticated uploads to exam-schedules"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'exam-schedules');
```

**Policy 2: Allow View**
```sql
CREATE POLICY "Allow authenticated reads from exam-schedules"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'exam-schedules');
```

**Policy 3: Allow Update Own Files**
```sql
CREATE POLICY "Allow users to update own files in exam-schedules"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'exam-schedules' AND auth.uid() = owner)
WITH CHECK (bucket_id = 'exam-schedules' AND auth.uid() = owner);
```

**Policy 4: Allow Delete Own Files**
```sql
CREATE POLICY "Allow users to delete own files in exam-schedules"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'exam-schedules' AND auth.uid() = owner);
```

---

## 🧪 Verify Setup

Run this in SQL Editor:

```sql
-- Check bucket exists
SELECT * FROM storage.buckets WHERE id = 'exam-schedules';

-- Check policies exist
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%exam-schedules%';
```

**Expected Results:**
- Bucket: 1 row (exam-schedules)
- Policies: 4 rows (INSERT, SELECT, UPDATE, DELETE)

---

## 🎯 After Setup

1. **Refresh your browser**
2. **Try uploading again**
3. ✅ Should work now!

---

## 🐛 Still Not Working?

### **Check Authentication:**
```sql
-- Verify you're authenticated
SELECT auth.uid();
-- Should return your user ID, not NULL
```

### **Check Bucket Permissions:**
```sql
-- Check bucket settings
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'exam-schedules';
```

### **Check Policy Details:**
```sql
-- See full policy details
SELECT * FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%exam-schedules%';
```

---

## 📋 Quick Checklist

- [ ] Bucket `exam-schedules` exists
- [ ] Bucket is **private** (not public)
- [ ] File size limit is 10MB
- [ ] Allowed MIME types include PDF, DOC, DOCX
- [ ] 4 RLS policies exist (INSERT, SELECT, UPDATE, DELETE)
- [ ] User is authenticated (auth.uid() is not null)
- [ ] Browser refreshed after setup

---

## ✅ Success Indicators

**After running the SQL:**
```
✅ Exam schedules storage bucket setup complete!
✅ Bucket: exam-schedules (private, 10MB limit)
✅ RLS Policies: 4 policies created
✅ Authenticated users can now upload/view/delete files
```

**When uploading:**
- No more RLS errors
- File uploads successfully
- See "File uploaded successfully!" toast
- See "Processing file with AI..." message

---

## 🎊 Summary

**Problem:** RLS policy blocking uploads
**Solution:** Create bucket + Add 4 RLS policies
**Time:** 2 minutes
**Status:** ✅ Fixed!

---

**Run the SQL script and you're done!** 🚀
