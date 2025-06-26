#!/bin/bash
echo "🔄 Generating TypeScript types from database..."
npx supabase gen types typescript --local > apps/web/lib/supabase/types.ts
echo "✅ Types generated successfully"
