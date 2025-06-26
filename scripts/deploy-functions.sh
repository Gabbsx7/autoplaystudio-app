#!/bin/bash
echo "🚀 Deploying Supabase Edge Functions..."
npx supabase functions deploy copilot
npx supabase functions deploy notify
npx supabase functions deploy figma-webhook
echo "✅ Functions deployed successfully"
