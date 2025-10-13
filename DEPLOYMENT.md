# Deployment Configuration Guide

## 🚀 Quick Setup for Render + Netlify + NeonDB

### 📋 Prerequisites
- GitHub repository
- Render account (free tier)
- Netlify account (free tier)
- NeonDB account (free tier)

---

## 🐘 Step 1: Set Up NeonDB (PostgreSQL Database)

### Create Database:
1. Go to [neon.tech](https://neon.tech)
2. Sign up / Log in
3. Create new project: `motor-dashboard`
4. Copy your connection string (it looks like this):
   ```
   postgresql://neondb_owner:npg_Kq8giIcTEf2D@ep-misty-sunset-adafp6or-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

### Why NeonDB?
- ✅ **FREE** (5GB storage, 0.5GB RAM)
- ✅ **PERSISTENT** (data never lost)
- ✅ **No Render paid plan needed**
- ✅ **Automatic backups**
- ✅ **Better performance than SQLite**

---

## 🖥️ Step 2: Configure Render (Backend)

### Environment Variables:
Go to your Render service → **Environment** → Add these:

| Key | Value | Description |
|-----|-------|-------------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_Kq8giIcTEf2D@ep-misty-sunset-adafp6or-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require` | NeonDB connection string |
| `FRONTEND_URL` | `https://motor-speed-temperature.netlify.app` | Your Netlify URL |

### What NOT to Set:
- ❌ Don't set `ASPNETCORE_URLS` (let Dockerfile handle it)
- ❌ Don't set `DB_PATH` (only needed for SQLite)

### After Setup:
- Render will auto-redeploy
- Backend will use PostgreSQL
- Data will persist forever!

---

## 🌐 Step 3: Configure Netlify (Frontend)

### Environment Variables:
Go to your Netlify site → **Site settings** → **Environment variables** → Add these:

| Key | Value | Description |
|-----|-------|-------------|
| `VITE_API_URL` | `https://embedded-motor-engine-speed-temperature.onrender.com` | Render backend URL |
| `VITE_SIGNALR_URL` | `https://embedded-motor-engine-speed-temperature.onrender.com/motorHub` | SignalR hub URL |
| `VITE_ADMIN_PASSKEY` | `YourSecurePasskey123` | Custom passkey for delete button |

### Default Passkey:
If you don't set `VITE_ADMIN_PASSKEY`, the default is `motor2025`.

**⚠️ IMPORTANT:** Choose a secure passkey that only you know!

### After Setup:
- Netlify will auto-redeploy
- Delete button will require your passkey
- Only you can delete data!

---

## 🔒 Step 4: Security - Delete Button Protection

### How It Works:
1. User clicks **"Delete All Data"**
2. ⚠️ **Warning**: "This will delete ALL motor readings permanently!"
3. 🔒 **Passkey Prompt**: "Enter the admin passkey to delete all data:"
4. ✅ **Validation**: Checks against `VITE_ADMIN_PASSKEY`
5. 🔐 **Final Confirmation**: "This is your FINAL confirmation. Delete ALL motor readings?"
6. 🗑️ **Delete**: Only if all steps passed

### Change Your Passkey:
**On Netlify:**
- Set `VITE_ADMIN_PASSKEY` to your secure passkey
- Redeploy

**Default:** `motor2025`

---

## 🎯 Step 5: Test Your Deployment

### After Everything is Set Up:

1. **Wait for both deployments to complete** (~2-3 minutes each)
2. **Visit your Netlify site**: `https://motor-speed-temperature.netlify.app`
3. **Generate motor readings**: Click "Start Motor" button 5-10 times
4. **Verify data persists**: Refresh the page, data should still be there
5. **Test delete protection**: Try to delete data, it should ask for passkey

### Expected Results:
- ✅ SignalR shows "Live"
- ✅ All dashboards show data
- ✅ Data persists after page refresh
- ✅ Delete button requires passkey
- ✅ No CORS errors
- ✅ No 500 errors

---

## 📊 Database Comparison

| Feature | SQLite (Render Free) | SQLite (Render Paid) | NeonDB PostgreSQL |
|---------|---------------------|----------------------|-------------------|
| **Cost** | Free | $7/month | **Free** |
| **Persistent** | ❌ No | ✅ Yes | ✅ **Yes** |
| **Storage** | Ephemeral | 1GB disk | **5GB** |
| **Backups** | None | Manual | **Automatic** |
| **Performance** | Good | Good | **Excellent** |
| **Scalability** | Limited | Limited | **High** |
| **Recommendation** | ❌ Testing only | ⚠️ Small projects | ✅ **BEST CHOICE** |

---

## 🔧 Troubleshooting

### Data Keeps Disappearing:
- ✅ Make sure `DATABASE_URL` is set in Render
- ✅ Verify NeonDB connection string is correct
- ✅ Check Render logs for "🐘 Using PostgreSQL database"

### Delete Button Not Asking for Passkey:
- ✅ Make sure `VITE_ADMIN_PASSKEY` is set in Netlify
- ✅ Redeploy Netlify after adding the variable
- ✅ Clear browser cache

### CORS Errors:
- ✅ Verify `FRONTEND_URL` is set in Render
- ✅ Check it matches your Netlify URL exactly
- ✅ Wait for Render to redeploy after changes

---

## 📝 Your Current Connection String

**NeonDB Connection String:**
```
postgresql://neondb_owner:npg_Kq8giIcTEf2D@ep-misty-sunset-adafp6or-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Add this to Render as `DATABASE_URL` environment variable!**

---

## ✅ Final Checklist

- [ ] NeonDB database created
- [ ] `DATABASE_URL` added to Render
- [ ] `VITE_ADMIN_PASSKEY` added to Netlify (optional, defaults to `motor2025`)
- [ ] Both services redeployed
- [ ] Motor readings generated
- [ ] Data persists after refresh
- [ ] Delete button requires passkey

---

**Happy deploying! 🎉**

