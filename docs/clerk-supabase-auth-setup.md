# Clerk Third-Party Auth Configuration for Supabase

This guide walks through configuring Clerk as a Supabase Third-Party Auth provider so authenticated project requests can pass RLS policies.

## Prerequisites

- Supabase project created: `dwydopeutiwjhclptril.supabase.co`
- Migrations applied: `project_persistence` and `optimize_project_policies`
- Clerk application configured with test keys in `.env.local`

## Configuration Steps

### 1. Get Clerk JWKS URL

Your Clerk JWKS URL follows this format:
```
https://your-clerk-domain/.well-known/jwks.json
```

For your test environment:
```
https://funny-elephant-2247.clerk.accounts.dev/.well-known/jwks.json
```

### 2. Configure Supabase Third-Party Auth

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/dwydopeutiwjhclptril
2. Navigate to **Authentication** → **Providers**
3. Scroll to **Third-Party Auth** section
4. Click **Add Provider** or **Configure**
5. Fill in the configuration:

```
Provider Name: Clerk
JWKS URI: https://funny-elephant-2247.clerk.accounts.dev/.well-known/jwks.json
```

### 3. Verify JWT Claims

Ensure your Clerk session tokens include the required claims for Supabase RLS:

**Required claims:**
- `sub` — Clerk user ID (stored in `owner_id` and `user_id` columns)
- `role: authenticated` — Required for Supabase RLS policies

**Clerk JWT Template (if needed):**
If the default Clerk token doesn't include `role: authenticated`, create a custom JWT template:

1. Go to Clerk Dashboard → **JWT Templates**
2. Create a new template named "supabase"
3. Add custom claims:
```json
{
  "role": "authenticated"
}
```
4. Update your API routes to use this template when calling `getToken`:
```typescript
const token = await getToken({ template: 'supabase' })
```

### 4. Test the Integration

After configuration, test that RLS policies work:

1. Sign in to the application
2. Create a project via the UI
3. Check Supabase logs for successful authenticated queries
4. Verify the project appears in the `projects` table with your Clerk user ID in `owner_id`

### 5. Verify RLS Policies

Run these queries in the Supabase SQL Editor to verify policies are active:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('projects', 'project_members');

-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public';

-- Test authenticated access (must be run with a Clerk JWT)
-- This will only work through the application, not direct SQL
SELECT * FROM projects;
```

## Troubleshooting

### RLS Policies Not Working

**Symptom:** API returns empty results or "Project not found"

**Check:**
1. Verify Clerk JWKS URL is correct and accessible
2. Check Supabase logs for JWT validation errors
3. Ensure `role: authenticated` claim is in the token
4. Verify `getToken()` is being called in API routes

### Token Validation Errors

**Symptom:** 401 Unauthorized from Supabase

**Check:**
1. JWKS URL is correct and publicly accessible
2. Token hasn't expired
3. Clerk domain matches the JWKS URL
4. Third-Party Auth provider is enabled in Supabase

### User ID Not Matching

**Symptom:** Cannot create or access own projects

**Check:**
1. `owner_id` in database matches Clerk user ID from JWT `sub` claim
2. RLS policies use `((select auth.jwt()) ->> 'sub')` correctly
3. Clerk user ID format matches (should be text like `user_2...`)

## Current Status

✅ Supabase project created
✅ Environment variables configured
✅ Migrations applied
✅ Database schema with RLS policies
✅ Server client implementation
✅ API routes with Clerk authentication
⏳ Clerk Third-Party Auth configuration (manual step in Supabase dashboard)

## Next Steps After Configuration

Once Clerk Third-Party Auth is configured:

1. Test project creation through the UI
2. Verify projects appear in the sidebar
3. Test rename and delete operations
4. Confirm collaborator access works (when implemented)
5. Update `context/progress-tracker.md` to mark configuration complete
