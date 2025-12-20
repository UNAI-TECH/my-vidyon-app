# 🚀 Quick Reference - Multi-Language Translation

## 📌 Quick Start

```typescript
import { useTranslation } from '@/i18n/TranslationContext';
import { LanguageSelector } from '@/components/common/LanguageSelector';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t.common.welcome}</h1>;
}
```

## 🌍 Available Languages

| Code | Language | Native Name |
|------|----------|-------------|
| `en` | English | English |
| `ta` | Tamil | தமிழ் |
| `te` | Telugu | తెలుగు |
| `kn` | Kannada | ಕನ್ನಡ |
| `ml` | Malayalam | മലയാളം |
| `es` | Spanish | Español |
| `hi` | Hindi | हिन्दी |

## 📖 Common Translation Keys

### Buttons & Actions
```typescript
t.common.save        // "Save"
t.common.cancel      // "Cancel"
t.common.delete      // "Delete"
t.common.edit        // "Edit"
t.common.submit      // "Submit"
t.common.search      // "Search"
t.common.filter      // "Filter"
t.common.download    // "Download"
t.common.upload      // "Upload"
```

### Login Page
```typescript
t.login.title              // "EduERP"
t.login.welcomeBack        // "Welcome Back"
t.login.emailAddress       // "Email Address"
t.login.password           // "Password"
t.login.signIn             // "Sign in"
t.login.student            // "Student"
t.login.faculty            // "Faculty"
t.login.institution        // "Institution"
t.login.admin              // "Admin"
```

### Navigation
```typescript
t.nav.dashboard      // "Dashboard"
t.nav.courses        // "My Courses"
t.nav.timetable      // "Timetable"
t.nav.attendance     // "Attendance"
t.nav.assignments    // "Assignments"
t.nav.grades         // "Grades"
t.nav.notifications  // "Notifications"
```

### Dashboard
```typescript
t.dashboard.overview         // "Overview"
t.dashboard.recentActivity   // "Recent Activity"
t.dashboard.upcomingEvents   // "Upcoming Events"
t.dashboard.statistics       // "Statistics"
```

### Student
```typescript
t.student.currentGPA          // "Current GPA"
t.student.attendanceRate      // "Attendance Rate"
t.student.pendingAssignments  // "Pending Assignments"
t.student.upcomingExams       // "Upcoming Exams"
```

### Messages
```typescript
t.messages.loginSuccess   // "Login successful!"
t.messages.loginError     // "Invalid credentials..."
t.messages.saveSuccess    // "Saved successfully!"
t.messages.saveError      // "Failed to save..."
```

## 🔧 API Reference

### useTranslation Hook

```typescript
const {
  t,           // Translation object
  language,    // Current language code
  setLanguage, // Function to change language
  translate    // Function for dynamic keys
} = useTranslation();
```

### Examples

```typescript
// Basic usage
<h1>{t.common.welcome}</h1>

// Get current language
console.log(language); // "en", "ta", etc.

// Change language
setLanguage('ta'); // Switch to Tamil

// Dynamic keys
translate('common.welcome'); // Same as t.common.welcome
```

## 🎨 Adding Language Selector

```typescript
import { LanguageSelector } from '@/components/common/LanguageSelector';

// Add anywhere in your component
<LanguageSelector />
```

## ✅ Where It's Already Added

- ✅ Login Page (top-right)
- ✅ All Dashboard Headers (desktop & mobile)
  - Student Dashboard
  - Faculty Dashboard
  - Institution Dashboard
  - Admin Dashboard

## 💡 Tips

1. **Always use translation keys** instead of hardcoded text
2. **Language persists** across browser sessions (localStorage)
3. **Type-safe** - TypeScript will warn if key doesn't exist
4. **Instant switching** - No page reload needed
5. **All languages** have the same keys (guaranteed by TypeScript)

## 🐛 Troubleshooting

**Translation not showing?**
- Check if key exists in all language files
- Verify you're using `useTranslation()` hook
- Ensure component is wrapped by TranslationProvider

**Language not persisting?**
- Check browser localStorage for `eduErp_language`
- Clear localStorage and try again

**TypeScript errors?**
- All language files must have identical keys
- Check `TranslationKeys` type in `en.ts`

## 📚 Full Documentation

See `.agent/TRANSLATION_GUIDE.md` for complete documentation
See `.agent/translation-examples.tsx` for working code examples
See `.agent/TRANSLATION_SUMMARY.md` for implementation summary
