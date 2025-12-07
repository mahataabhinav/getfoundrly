# Apply BrandDNA Migration

The `brand_dna` table needs to be created in your Supabase database. Follow these steps:

## Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/20251203141634_create_brand_dna_table.sql`
5. Paste it into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

## Option 2: Via Supabase CLI (If you have it installed)

```bash
# If you have Supabase CLI installed and linked to your project
supabase db push

# Or apply specific migration
supabase migration up
```

## Verify the Migration

After applying, verify the table was created:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see `brand_dna` table in the list
3. Check that it has the following columns:
   - id
   - brand_id
   - user_id
   - status
   - completion_score
   - dna_data (JSONB)
   - provenance (JSONB)
   - versions (JSONB)
   - created_at
   - updated_at
   - last_crawled_at

## Troubleshooting

If you get an error about the table already existing, you can drop it first:

```sql
DROP TABLE IF EXISTS public.brand_dna CASCADE;
```

Then re-run the migration.

