# Database Setup Instructions

## 🔧 Fix Missing Database Columns

The onboarding system requires additional columns in the `users` table. Follow these steps to fix the database schema:

## Method 1: Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `gwrvapseguvhpgpmczsy`

2. **Open SQL Editor**
   - Navigate to "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Migration**
   Copy and paste this SQL code:

   ```sql
   -- Add missing columns for driver onboarding
   ALTER TABLE users 
   ADD COLUMN IF NOT EXISTS driver_experience TEXT,
   ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

   -- Update existing drivers to have onboarding_completed = true if they have basic info
   UPDATE users 
   SET onboarding_completed = true 
   WHERE role = 'Driver' 
   AND full_name IS NOT NULL 
   AND full_name != '' 
   AND onboarding_completed IS NULL;
   ```

4. **Execute the Query**
   - Click "Run" button
   - You should see "Success. No rows returned"

## Method 2: Using the Migration File

1. **Find the migration file** in your project:
   - `database_migration.sql`

2. **Copy contents to Supabase SQL Editor** and run it

## Method 3: Verify Schema

After running the migration, verify the columns exist:

```sql
-- Check if columns were added successfully
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('driver_experience', 'onboarding_completed');
```

You should see both columns listed.

## Storage Setup (Optional)

If you want to use proper file storage instead of base64:

1. **Go to Storage section** in Supabase Dashboard
2. **Create new bucket**:
   - Name: `driver-assets`
   - Public: ✅ Yes
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

## Verification

After completing the database setup:

1. **Test driver registration**:
   - Register a new driver account
   - Complete the onboarding process
   - Should work without errors

2. **Check data**:
   ```sql
   SELECT id, full_name, driver_license_number, driver_experience, onboarding_completed 
   FROM users 
   WHERE role = 'Driver';
   ```

## Troubleshooting

**If you still see column errors:**
1. Make sure you're connected to the correct database
2. Check that the migration ran successfully
3. Refresh your browser/clear cache
4. The system will fall back gracefully even if columns are missing

**Current Fallback Behavior:**
- If `driver_experience` is missing: Still saves other data
- If `onboarding_completed` is missing: Uses basic field checks
- System remains functional during migration

## Support

The system is designed to work even with missing columns, but for full functionality, please run the database migration above.
