import supabase from '@/lib/supabase'

export default function UseGetPublicUrlSupabase({ path }: { path: string }) {
  const { data } = supabase.storage.from('images').getPublicUrl(path)
  return data
}
