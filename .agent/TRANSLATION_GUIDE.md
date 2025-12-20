# Multi-Language Translation System - Implementation Guide

## ✅ What Has Been Implemented

### 1. **Translation Files** (3 Languages)
- **English (en)** - Default language
- **Spanish (es)** - Español
- **Hindi (hi)** - हिन्दी

Location: `src/i18n/translations/`

### 2. **Translation Context & Provider**
- Global state management for language selection
- Persistent language preference (localStorage)
- Easy-to-use `useTranslation()` hook

Location: `src/i18n/TranslationContext.tsx`

### 3. **Language Selector Component**
- Dropdown menu with all available languages
- Shows current language
- Globe icon for easy identification

Location: `src/components/common/LanguageSelector.tsx`

### 4. **Integration Points**
- ✅ App.tsx - Wrapped with TranslationProvider
- ✅ LoginPage - Fully translated with language selector

---

## 🚀 How to Use Translations in Your Components

### Basic Usage

```typescript
import { useTranslation } from '@/i18n/TranslationContext';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t.common.welcome}</h1>
      <p>{t.dashboard.overview}</p>
    </div>
  );
}
```

### Using the Language Selector

```typescript
import { LanguageSelector } from '@/components/common/LanguageSelector';

function Header() {
  return (
    <header>
      <LanguageSelector />
    </header>
  );
}
```

### Accessing Current Language

```typescript
import { useTranslation } from '@/i18n/TranslationContext';

function MyComponent() {
  const { language, setLanguage } = useTranslation();
  
  console.log('Current language:', language); // 'en', 'es', or 'hi'
  
  // Change language programmatically
  setLanguage('es');
}
```

### Using the translate() Helper (for dynamic keys)

```typescript
import { useTranslation } from '@/i18n/TranslationContext';

function MyComponent() {
  const { translate } = useTranslation();
  
  const key = 'common.welcome';
  return <h1>{translate(key)}</h1>;
}
```

---

## 📝 Available Translation Keys

### Common
- `common.welcome`, `common.loading`, `common.error`, `common.success`
- `common.save`, `common.cancel`, `common.delete`, `common.edit`
- `common.view`, `common.download`, `common.upload`, `common.search`
- And more...

### Login Page
- `login.title`, `login.subtitle`, `login.description`
- `login.welcomeBack`, `login.signInMessage`
- `login.emailAddress`, `login.password`
- `login.student`, `login.faculty`, `login.institution`, `login.admin`
- And more...

### Navigation
- `nav.dashboard`, `nav.courses`, `nav.timetable`
- `nav.attendance`, `nav.assignments`, `nav.grades`
- And more...

### Dashboard
- `dashboard.overview`, `dashboard.recentActivity`
- `dashboard.upcomingEvents`, `dashboard.statistics`

### Role-Specific
- `student.*` - Student-specific translations
- `faculty.*` - Faculty-specific translations
- `institution.*` - Institution-specific translations
- `admin.*` - Admin-specific translations

### Messages
- `messages.loginSuccess`, `messages.loginError`
- `messages.saveSuccess`, `messages.saveError`
- And more...

---

## 🌍 Adding a New Language

### Step 1: Create Translation File

Create a new file in `src/i18n/translations/` (e.g., `fr.ts` for French):

```typescript
import { TranslationKeys } from './en';

export const fr: TranslationKeys = {
  common: {
    welcome: 'Bienvenue',
    loading: 'Chargement...',
    // ... translate all keys
  },
  login: {
    title: 'EduERP',
    subtitle: 'Planification des Ressources d\'Entreprise',
    // ... translate all keys
  },
  // ... translate all sections
};
```

### Step 2: Update Index File

Edit `src/i18n/translations/index.ts`:

```typescript
import { en } from './en';
import { es } from './es';
import { hi } from './hi';
import { fr } from './fr'; // Add this

export const translations = {
  en,
  es,
  hi,
  fr, // Add this
};

export type Language = keyof typeof translations;

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'fr', name: 'French', nativeName: 'Français' }, // Add this
];
```

---

## 🎯 Best Practices

1. **Always use translation keys** instead of hardcoded strings
2. **Add the LanguageSelector** to your layout headers/navigation
3. **Keep translation keys organized** by feature/section
4. **Use descriptive key names** that make sense in English
5. **Test all languages** to ensure proper display
6. **Consider text length** - translations may be longer/shorter

---

## 📍 Where to Add Language Selector

### Option 1: In Layout Headers
Add to `StudentLayout.tsx`, `FacultyLayout.tsx`, etc.:

```typescript
import { LanguageSelector } from '@/components/common/LanguageSelector';

// In the header section
<div className="flex items-center gap-4">
  <LanguageSelector />
  {/* Other header items */}
</div>
```

### Option 2: In Sidebar
Add to the sidebar navigation:

```typescript
<div className="sidebar-footer">
  <LanguageSelector />
</div>
```

### Option 3: In User Menu
Add to user dropdown menu alongside logout, profile, etc.

---

## 🔧 Troubleshooting

### Language not persisting?
- Check browser localStorage for `eduErp_language` key
- Clear localStorage and try again

### Translation not showing?
- Verify the key exists in all language files
- Check for typos in the key path
- Ensure TranslationProvider wraps your component

### TypeScript errors?
- All translation files must match the `TranslationKeys` type
- Every key in `en.ts` must exist in other language files

---

## 📦 Files Created

1. `src/i18n/translations/en.ts` - English translations
2. `src/i18n/translations/es.ts` - Spanish translations
3. `src/i18n/translations/hi.ts` - Hindi translations
4. `src/i18n/translations/index.ts` - Translation exports
5. `src/i18n/TranslationContext.tsx` - Context & Provider
6. `src/components/common/LanguageSelector.tsx` - Language selector UI

## 📝 Files Modified

1. `src/App.tsx` - Added TranslationProvider
2. `src/pages/auth/LoginPage.tsx` - Integrated translations

---

## ✨ Features

- ✅ 3 languages supported (English, Spanish, Hindi)
- ✅ Persistent language selection
- ✅ Type-safe translations
- ✅ Easy to add new languages
- ✅ Dropdown language selector
- ✅ Fully integrated login page
- ✅ Ready for global deployment

---

**Next Steps:**
1. Add LanguageSelector to all dashboard layouts
2. Translate remaining pages (Student, Faculty, Institution, Admin dashboards)
3. Add more languages as needed
4. Test all translations thoroughly
