// Supabase 클라이언트 초기화 및 설정

const DEFAULT_SUPABASE_URL = 'https://lhjuacwkdngqmshdrtez.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_MO0FHYiabAkadOfv9jqJEw_O6hY04kF';

const SUPABASE_CONFIG = {
  url: localStorage.getItem('SUPABASE_URL') || DEFAULT_SUPABASE_URL,
  anonKey: localStorage.getItem('SUPABASE_ANON_KEY') || DEFAULT_SUPABASE_ANON_KEY
};

let supabaseClient = null;

function initSupabase(url, anonKey) {
  if (url && anonKey && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(url, anonKey);
      return true;
    } catch (e) {
      console.error('Supabase 클라이언트 초기화 실패:', e);
      return false;
    }
  }
  return false;
}

// 초기 로드 시 시도
if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
  initSupabase(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
}
