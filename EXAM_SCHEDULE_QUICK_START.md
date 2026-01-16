# Exam Schedule Feature - Quick Start Guide

## 🚀 What's Been Created

### 1. **Implementation Plan** (`EXAM_SCHEDULE_IMPLEMENTATION_PLAN.md`)
- Complete feature specification
- Database schema design
- UI/UX flow
- Technical considerations

### 2. **Database Migration** (`supabase/migrations/create_exam_schedules.sql`)
- 3 tables created:
  - `exam_schedules` - Main schedule metadata
  - `exam_schedule_entries` - Individual exam entries
  - `exam_schedule_uploads` - File uploads tracking
- RLS policies for security
- Indexes for performance

## 📋 Next Steps to Implement

### Step 1: Run Database Migration
```bash
# In Supabase SQL Editor, run:
supabase/migrations/create_exam_schedules.sql
```

### Step 2: Create Storage Bucket
1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Settings:
   - **Name:** `exam-schedules`
   - **Public:** ❌ (unchecked - private)
   - **File size limit:** `10485760` (10MB)
   - **Allowed MIME types:** 
     - `application/pdf`
     - `application/msword`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### Step 3: Set Storage Policies
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload exam schedules"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'exam-schedules');

-- Allow authenticated users to view
CREATE POLICY "Authenticated users can view exam schedules"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'exam-schedules');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their own exam schedule uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'exam-schedules' AND owner = auth.uid());
```

## 🎨 UI Components to Build

### Phase 1: Faculty Portal (Priority)

#### 1. Modify `FacultyTimetable.tsx`
Add third tab: "Exam Schedule"

```typescript
<Tabs defaultValue="my-schedule">
  <TabsList>
    <TabsTrigger value="my-schedule">My Schedule</TabsTrigger>
    <TabsTrigger value="class-timetable">Class Timetable</TabsTrigger>
    <TabsTrigger value="exam-schedule">Exam Schedule</TabsTrigger> {/* NEW */}
  </TabsList>
  
  {/* Existing tabs... */}
  
  <TabsContent value="exam-schedule">
    <ExamScheduleManager />
  </TabsContent>
</Tabs>
```

#### 2. Create `ExamScheduleManager` Component
Main container for exam schedule management

**Features:**
- Exam type selector
- Manual entry form
- File upload interface
- Preview table
- Submit/Edit/Delete actions

#### 3. Create `ExamTypeSelector` Component
Dropdown to select exam type:
- Mid-Term 1
- Quarterly
- Mid-Term 2
- Half-yearly
- Model Exam
- Annual

#### 4. Create `ManualEntryForm` Component
Form to manually add exam entries:
- Date picker
- Time range (start - end)
- Subject dropdown
- Syllabus/Notes textarea
- Add/Remove entry buttons

#### 5. Create `FileUploadForm` Component
File upload interface:
- Drag & drop or click to upload
- File type validation (PDF, DOCX)
- Upload progress
- Preview extracted data (future: AI parsing)

#### 6. Create `ExamSchedulePreview` Component
Table showing exam schedule entries (like the image you provided):
- Columns: Date & Day | Time | Subject | Syllabus/Notes
- Edit/Delete row actions
- Download PDF button

### Phase 2: Student Portal

#### 7. Modify `StudentTimetable.tsx`
Add "Exam Schedule" tab

#### 8. Create `ExamScheduleView` Component
Read-only view for students:
- Filter by exam type
- Display schedule table
- Download PDF option

## 📊 Data Flow

### Creating Exam Schedule (Faculty):

1. **Select Exam Type**
   ```typescript
   const examTypes = [
     { value: 'mid-term-1', label: 'Mid-Term 1', short: 'Mid-Term' },
     { value: 'quarterly', label: 'Quarterly', short: 'Quarterly' },
     { value: 'mid-term-2', label: 'Mid-Term 2', short: 'Mid-Term' },
     { value: 'half-yearly', label: 'Half-yearly', short: 'Half-yearly' },
     { value: 'model', label: 'Model Exam', short: 'Model' },
     { value: 'annual', label: 'Annual', short: 'Annual' }
   ];
   ```

2. **Choose Method: Manual or Upload**
   - Toggle between two modes

3. **Manual Entry:**
   ```typescript
   const entry = {
     exam_date: '2026-05-10',
     day_of_week: 'Monday',
     start_time: '09:00',
     end_time: '12:00',
     subject: 'Mathematics',
     syllabus_notes: 'Chapters 1-5'
   };
   ```

4. **Submit to Database:**
   ```typescript
   // 1. Create exam_schedule
   const { data: schedule } = await supabase
     .from('exam_schedules')
     .insert({
       institution_id: user.institutionId,
       class_id: user.classId,
       section: user.section,
       exam_type: 'mid-term-1',
       exam_display_name: 'Mid-Term 1',
       academic_year: '2025-2026',
       created_by: user.id
     })
     .select()
     .single();

   // 2. Insert entries
   await supabase
     .from('exam_schedule_entries')
     .insert(entries.map(e => ({
       exam_schedule_id: schedule.id,
       ...e
     })));
   ```

### Viewing Exam Schedule (Student):

```typescript
// Fetch schedules for student's class
const { data: schedules } = await supabase
  .from('exam_schedules')
  .select(`
    *,
    exam_schedule_entries (*)
  `)
  .eq('institution_id', user.institutionId)
  .eq('class_id', user.classId)
  .eq('section', user.section)
  .order('created_at', { ascending: false });
```

## 🔐 Security (RLS)

**Faculty:**
- ✅ Can create schedules for their institution
- ✅ Can view all schedules in their institution
- ✅ Can edit/delete only their own schedules

**Students:**
- ✅ Can view schedules for their class only
- ❌ Cannot create/edit/delete

**Parents:**
- ✅ Can view schedules for their child's class
- ❌ Cannot create/edit/delete

## 📱 Responsive Design

- Mobile: Stack form fields vertically
- Tablet: 2-column layout
- Desktop: Full table view

## 🎯 MVP Scope (Phase 1)

**Include:**
- ✅ Exam type selection
- ✅ Manual entry form
- ✅ Preview table
- ✅ Submit to database
- ✅ Student view
- ✅ Download PDF (basic)

**Exclude (Future):**
- ⏳ AI file parsing (use manual entry for now)
- ⏳ Advanced PDF generation
- ⏳ Email notifications
- ⏳ Bulk edit

## 🚧 Current Status

✅ **Completed:**
- Implementation plan
- Database schema
- Migration SQL

🔄 **Next (Your Task):**
1. Run database migration
2. Create storage bucket
3. Build UI components
4. Integrate with Faculty/Student Timetable pages

## 💡 Tips

1. **Start Simple:** Build manual entry first, add file upload later
2. **Test Incrementally:** Test each component as you build
3. **Use Existing Patterns:** Follow the same patterns as Class Timetable
4. **Realtime Updates:** Use Supabase subscriptions for live updates

## 📞 Need Help?

Refer to:
- `EXAM_SCHEDULE_IMPLEMENTATION_PLAN.md` - Full specification
- `supabase/migrations/create_exam_schedules.sql` - Database schema
- Existing timetable components for UI patterns

---

**Ready to start building!** 🚀

Run the migration first, then I can help you build the UI components.
