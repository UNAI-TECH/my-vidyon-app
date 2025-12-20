# Admin Dashboard - Quick Start Guide

## 🚀 How to Access

1. **Login as Admin**
   - Navigate to `/login`
   - Use admin credentials
   - You'll be redirected to `/admin`

## 📍 Main Pages

### 1. Admin Dashboard (`/admin`)
**What you'll see:**
- 5 Indian matriculation school cards
- Stats: Total Institutions, Students, Staff, System Health
- System load chart
- User distribution chart
- System alerts
- Recent activity log

**Actions:**
- Click **"Add Institution"** button → Go to multi-step form
- Click any **institution card** → Go to detail view
- Click **"View All"** → Go to institution management

---

### 2. Add Institution (`/admin/add-institution`)
**6-Step Process:**

**Step 1: Basic Details**
- Fill in institution name, type, address, contact info
- Upload logo (optional)
- Set status (Active/Inactive)

**Step 2: Groups & Classes**
- Click "Add Group" (e.g., Primary, Middle School, High School)
- For each group, click "Add Class" (e.g., LKG, UKG, 1-12)
- Click section buttons (A, B, C, D, E) to add sections
- Remove with trash icon

**Step 3: Subjects**
- Click "Add Subject"
- Enter subject name, code, class, and group
- Add multiple subjects
- Remove with trash icon

**Step 4: Students**
- Choose **Manual Entry** or **Upload Excel**
- **Manual:** Click "Add Student" and fill form
- **Excel:** Download template, fill it, upload file

**Step 5: Staff**
- Choose **Manual Entry** or **Upload Excel**
- **Manual:** Click "Add Staff" and fill form
- **Excel:** Download template, fill it, upload file

**Step 6: Access & Roles**
- Review automatic role assignments
- See summary of all data
- Click "Submit & Create Institution"

**Navigation:**
- Use "Next" and "Previous" buttons
- Progress shown in stepper at top

---

### 3. Institution Detail (`/admin/institutions/:id`)
**Example:** `/admin/institutions/RPC001`

**8 Tabs Available:**

1. **Overview**
   - Quick stats
   - Recent activity
   - Contact information

2. **Students**
   - Complete student list
   - Attendance and performance
   - Export button

3. **Staff**
   - Complete staff list
   - Roles and assignments
   - Export button

4. **Classes & Subjects**
   - All classes with sections
   - Student count per class
   - Subject count

5. **Attendance**
   - Date-wise records
   - Class-wise breakdown
   - Percentage calculations

6. **Performance**
   - Exam results
   - Average scores
   - Pass rates

7. **Fee Status**
   - Collection status
   - Paid vs Pending
   - Collection rates

8. **Notifications**
   - Notification history
   - Send new notifications

**Admin Controls (Top Right):**
- **Edit Details** - Modify institution info
- **Disable/Enable** - Toggle institution status
- **Reset Data** - Clear institution data
- **Export** - Download reports

---

### 4. Institution Management (`/admin/institutions`)
**Features:**
- Search bar for finding institutions
- Filter button for advanced filtering
- Tabs: Active, Pending, Suspended
- Grid of institution cards
- Click any card to view details

---

## 🎯 Quick Actions on Institution Cards

Each card has 4 quick action buttons:
1. **View** - Open detail view
2. **Edit** - Edit institution
3. **Users** - Manage users
4. **Analytics** - View analytics

---

## 📊 Example Institutions

1. **Revoor Padmanabha Chattys Matriculation School**
   - ID: RPC001
   - Location: Chennai, Tamil Nadu
   - Students: 1,250
   - Staff: 68

2. **The Beloved Matriculation School**
   - ID: TBM001
   - Location: Coimbatore, Tamil Nadu
   - Students: 980
   - Staff: 52

3. **Venkateshwara Matriculation School**
   - ID: VMS001
   - Location: Madurai, Tamil Nadu
   - Students: 1,450
   - Staff: 75

4. **Mercury Matriculation School**
   - ID: MMS001
   - Location: Trichy, Tamil Nadu
   - Students: 820
   - Staff: 45

5. **Radha Krishna Matriculation School**
   - ID: RKM001
   - Location: Salem, Tamil Nadu
   - Students: 1,120
   - Staff: 58

---

## 🎨 Visual Features

### Institution Cards
- Hover effect with shadow
- Color-coded status badges
- Icon-based metrics
- Quick action buttons

### Multi-Step Form
- Progress stepper at top
- Visual step indicators
- Completed steps show checkmark
- Current step highlighted

### Detail View
- Tab-based navigation
- Data tables with sorting
- Export functionality
- Admin control buttons

---

## 💡 Tips

1. **Adding Institutions:**
   - Fill all required fields (marked with *)
   - You can skip optional fields
   - Use Excel upload for bulk data entry
   - Download templates before uploading

2. **Viewing Details:**
   - Click anywhere on card to open detail view
   - Use tabs to navigate different sections
   - Export data from any tab

3. **Managing Institutions:**
   - Use search to find specific institutions
   - Filter by status (Active/Pending/Suspended)
   - Quick actions available on each card

---

## 🔒 Admin Restrictions

**Admin CANNOT:**
- Modify academic records directly
- Change student marks manually
- Delete permanent records

**Admin CAN:**
- View all data
- Edit institution details
- Enable/Disable institutions
- Reset institution data
- Export reports
- Manage users and roles

---

## 🎯 Common Workflows

### Workflow 1: Add New Institution
1. Click "Add Institution" on dashboard
2. Complete all 6 steps
3. Review summary in Step 6
4. Click "Submit & Create Institution"
5. Redirected to dashboard

### Workflow 2: View Institution Details
1. From dashboard, click institution card
2. View overview tab
3. Navigate to other tabs as needed
4. Use admin controls if needed

### Workflow 3: Manage Multiple Institutions
1. Click "View All" on dashboard
2. Use search/filter to find institutions
3. Click cards to view details
4. Use quick actions for common tasks

---

## 🚀 Ready to Use!

All features are now live and ready to use. Navigate to `/admin` to get started!
