# Quick Start: Delete User Feature

## ⚡ Quick Deployment (3 Steps)

### Step 1: Deploy the Edge Function
```bash
npx supabase functions deploy delete-user --no-verify-jwt
```

### Step 2: Test in Your App
1. Go to Institution Portal → Users
2. Delete a test user
3. Verify they can't log in

### Step 3: Done! ✅

---

## 📋 What This Does

**Before:** Deleting a user only removed them from the database. They could still log in.

**After:** Deleting a user removes them from:
- ✅ Database tables (students/parents/profiles)
- ✅ Supabase Authentication
- ✅ **They cannot log in anymore**

---

## 🚨 Important Notes

1. **Deployment Required**: The edge function MUST be deployed for this to work
2. **Permanent Action**: Deleted users cannot be recovered
3. **Admin Only**: Only institution admins can delete users
4. **Enhanced Confirmation**: Users see a clear warning before deletion

---

## 🔧 Troubleshooting

### "Failed to delete user"
- Check if edge function is deployed: `npx supabase functions list`
- Check Supabase logs in dashboard

### "Insufficient permissions"
- Only institution admins can delete users
- Verify your role in the database

### Edge function not found
- Run: `npx supabase functions deploy delete-user --no-verify-jwt`
- Wait 1-2 minutes for deployment to complete

---

## 📚 Full Documentation

See `DELETE_USER_AUTHENTICATION.md` for:
- Complete deployment guide
- Security details
- Error handling
- Testing checklist
- Rollback instructions

---

## ✅ Verification Checklist

- [ ] Edge function deployed successfully
- [ ] Can delete a test student
- [ ] Can delete a test parent
- [ ] Can delete a test staff member
- [ ] Deleted users cannot log in
- [ ] UI updates after deletion
- [ ] Success message appears

---

## 🎯 Summary

**One command to deploy:**
```bash
npx supabase functions deploy delete-user --no-verify-jwt
```

**Then you're ready to use the complete delete functionality!**
