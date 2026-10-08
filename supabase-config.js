// Supabase 클라이언트 초기화 및 설정
// Supabase 대시보드(Project Settings -> API)에서 복사한 값을 입력하거나 브라우저 UI 설정에서 입력 가능합니다.

const SUPABASE_CONFIG = {
  // 기본 설정값 (필요 시 직접 기입하거나 화면 설정 모달에서 저장 가능)
  url: localStorage.getItem('SUPABASE_URL') || '',
  anonKey: localStorage.getItem('SUPABASE_ANON_KEY') || ''
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
