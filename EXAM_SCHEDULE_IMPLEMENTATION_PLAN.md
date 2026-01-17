# Exam Schedule Feature - Implementation Plan

## Overview
Add "Exam Schedule" tab to Faculty Timetable page where faculty can create/upload exam schedules for their assigned class. Students can view their class exam schedules in a separate tab.

## Features Required

### 1. Faculty Portal - Exam Schedule Tab
- **Location:** Faculty Timetable page (add 3rd tab)
- **Tabs:** My Schedule | Class Timetable | **Exam Schedule** (NEW)

### 2. Exam Type Selection
Faculty selects exam type from dropdown:
- Mid-Term 1 (Display: "Mid-Term 1", Short: "Mid-Term")
- Quarterly (Display: "Quarterly", Short: "Quarterly")
- Mid-Term 2 (Display: "Mid-Term 2", Short: "Mid-Term")
- Half-yearly (Display: "Half-yearly", Short: "Half-yearly")
- Model Exam (Display: "Model Exam", Short: "Model")
- Annual (Display: "Annual", Short: "Annual")

### 3. Creation Methods (Toggle)
After selecting exam type, faculty chooses:

#### Option A: Manual Upload
- Form with fields for each exam:
  - Date & Day (date picker)
  - Time (start time - end time)
  - Subject (dropdown from class subjects)
  - Syllabus/Notes (text area)
- Add multiple exam entries
- Preview before submit

#### Option B: Upload Timetable
- Upload PDF/Word file
- AI/OCR analyzes document
- Extracts:
  - Date & Day
  - Time
  - Subject
  - Syllabus/Notes
- Shows preview in table format
- Faculty can edit before submit

### 4. Student Portal - View Exam Schedule
- **Location:** Student Timetable page
- **New Tab:** Exam Schedule
- Shows all exam schedules for their class
- Filter by exam type
- Download PDF option

## Database Schema

### Table: `exam_schedules`
```sql
CREATE TABLE exam_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    section TEXT NOT NULL,
    exam_type TEXT NOT NULL, -- 'mid-term-1', 'quarterly', etc.
    exam_display_name TEXT NOT NULL, -- 'Mid-Term 1', 'Quarterly', etc.
    academic_year TEXT NOT NULL, -- '2025-2026'
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `exam_schedule_entries`
```sql
CREATE TABLE exam_schedule_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_schedule_id UUID REFERENCES exam_schedules(id) ON DELETE CASCADE,
    exam_date DATE NOT NULL,
    day_of_week TEXT NOT NULL, -- 'Monday', 'Tuesday', etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject TEXT NOT NULL,
    syllabus_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `exam_schedule_uploads`
```sql
CREATE TABLE exam_schedule_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_schedule_id UUID REFERENCES exam_schedules(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL, -- Supabase Storage URL
    file_type TEXT NOT NULL, -- 'pdf', 'docx', etc.
    uploaded_at TIMESTAMP DEFAULT NOW()
);
```

## Storage Bucket
- **Bucket Name:** `exam-schedules`
- **Public:** No (authenticated access only)
- **File Types:** PDF, DOCX, DOC
- **Max Size:** 10MB

## Implementation Steps

### Phase 1: Database Setup
1. Create tables
2. Create storage bucket
3. Set up RLS policies

### Phase 2: Faculty Portal UI
1. Add "Exam Schedule" tab to FacultyTimetable
2. Create exam type selection dropdown
3. Build manual entry form
4. Build file upload interface
5. Create preview component

### Phase 3: Backend Logic
1. Manual entry submission
2. File upload to storage
3. File parsing (PDF/DOCX) - placeholder for now
4. Data validation
5. CRUD operations

### Phase 4: Student Portal UI
1. Add "Exam Schedule" tab to StudentTimetable
2. Display exam schedules
3. Filter by exam type
4. Download PDF functionality

### Phase 5: Testing & Polish
1. Test all CRUD operations
2. Test file uploads
3. Test realtime updates
4. Responsive design
5. Error handling

## File Structure
```
src/
├── pages/
│   ├── faculty/
│   │   └── FacultyTimetable.tsx (modify - add Exam Schedule tab)
│   └── student/
│       └── StudentTimetable.tsx (modify - add Exam Schedule tab)
├── components/
│   └── exam-schedule/
│       ├── ExamTypeSelector.tsx (NEW)
│       ├── ManualEntryForm.tsx (NEW)
│       ├── FileUploadForm.tsx (NEW)
│       ├── ExamSchedulePreview.tsx (NEW)
│       └── ExamScheduleView.tsx (NEW - for students)
supabase/
└── migrations/
    └── create_exam_schedules.sql (NEW)
```

## UI/UX Flow

### Faculty Flow:
1. Navigate to Timetable → Exam Schedule tab
2. See exam type selector (if no schedule exists)
3. Select exam type (e.g., "Mid-Term 1")
4. Choose creation method:
   - Manual: Fill form → Add entries → Preview → Submit
   - Upload: Select file → AI analyzes → Preview → Edit → Submit
5. View created schedule
6. Edit/Delete options available

### Student Flow:
1. Navigate to Timetable → Exam Schedule tab
2. See list of exam schedules for their class
3. Click to view details
4. Download PDF option

## Technical Considerations

### File Parsing (Future Enhancement)
- For MVP: Manual entry only
- Phase 2: Integrate OCR/AI service (e.g., Google Vision API, Tesseract)
- Parse PDF/DOCX and extract table data
- Map to exam schedule format

### Realtime Updates
- Use Supabase realtime subscriptions
- Students see updates immediately when faculty creates/updates

### Permissions
- Faculty: Can only create schedules for their assigned class
- Students: Can only view schedules for their class
- RLS policies enforce this

## Next Steps
1. Create database migration
2. Build exam type selector component
3. Build manual entry form
4. Integrate with Faculty Timetable page
5. Add student view
