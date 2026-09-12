import { createClient, type SupabaseClient } from "@supabase/supabase-js"

interface SupabaseServerOptions {
  getToken: () => Promise<string | null>
}

export function createSupabaseServerClient({
  getToken,
}: SupabaseServerOptions): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    throw new Error("Supabase environment variables are not configured")
  }

  return createClient(url, publishableKey, {
    accessToken: getToken,
  })
}
