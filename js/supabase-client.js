/* ============================================================
   SUPABASE CLIENT
   ============================================================ */

const SUPABASE_URL = 'https://lwfevojspkbxxcqsijml.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_zDRXXXZU2tcG60yAzmOL-g_psxjyd-b'; // ← isi full key

// PENTING: pakai nama `supabaseClient` (bukan `supabase`)
// `supabase` sudah dipakai oleh library CDN
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('[Supabase] Client initialized');