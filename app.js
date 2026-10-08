// Supabase 기반 할 일(Todo) 관리 로직

let todos = [];
let currentFilter = 'all';

// DOM 요소
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const todoCount = document.getElementById('todoCount');
const filterBtns = document.querySelectorAll('.filter-btn');
const statusBanner = document.getElementById('statusBanner');
const statusText = document.getElementById('statusText');
const loadingSpinner = document.getElementById('loadingSpinner');

// 모달 요소
const configModal = document.getElementById('configModal');
const btnOpenConfig = document.getElementById('btnOpenConfig');
const btnCloseConfig = document.getElementById('btnCloseConfig');
const btnSaveConfig = document.getElementById('btnSaveConfig');
const btnResetConfig = document.getElementById('btnResetConfig');
const inputSupabaseUrl = document.getElementById('inputSupabaseUrl');
const inputSupabaseAnonKey = document.getElementById('inputSupabaseAnonKey');

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateStatusUI();
  fetchTodos();
});

function setupEventListeners() {
  // 폼 제출 (할 일 추가)
  todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = todoInput.value.trim();
    if (!title) return;
    await addTodo(title);
    todoInput.value = '';
  });

  // 필터 버튼 클릭
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTodos();
    });
  });

  // 모달 열기/닫기
  btnOpenConfig.addEventListener('click', () => {
    inputSupabaseUrl.value = localStorage.getItem('SUPABASE_URL') || '';
    inputSupabaseAnonKey.value = localStorage.getItem('SUPABASE_ANON_KEY') || '';
    configModal.classList.remove('hidden');
  });

  btnCloseConfig.addEventListener('click', () => {
    configModal.classList.add('hidden');
  });

  // 설정 저장
  btnSaveConfig.addEventListener('click', () => {
    const url = inputSupabaseUrl.value.trim();
    const key = inputSupabaseAnonKey.value.trim();

    if (!url || !key) {
      alert('Supabase Project URL과 Anon Key를 모두 입력해 주세요.');
      return;
    }

    localStorage.setItem('SUPABASE_URL', url);
    localStorage.setItem('SUPABASE_ANON_KEY', key);

    const initialized = initSupabase(url, key);
    if (initialized) {
      alert('Supabase 설정이 저장되었습니다!');
      configModal.classList.add('hidden');
      updateStatusUI();
      fetchTodos();
    } else {
      alert('Supabase 초기화에 실패했습니다. URL과 Key를 다시 확인해 주세요.');
    }
  });

  // 설정 초기화 (로컬 모드로 전환)
  btnResetConfig.addEventListener('click', () => {
    if (confirm('설정을 초기화하고 로컬 스토리지 모드로 전환하시겠습니까?')) {
      localStorage.removeItem('SUPABASE_URL');
      localStorage.removeItem('SUPABASE_ANON_KEY');
      supabaseClient = null;
      configModal.classList.add('hidden');
      updateStatusUI();
      fetchTodos();
    }
  });
}

// 상태 UI 갱신
function updateStatusUI() {
  if (supabaseClient) {
    statusBanner.className = 'status-banner online';
    statusText.textContent = '🟢 Supabase 클라우드 데이터베이스에 연결됨';
  } else {
    statusBanner.className = 'status-banner offline';
    statusText.textContent = '🟡 로컬 모드 작동 중 (우측 상단 ⚙️ 설정을 눌러 Supabase를 연결하세요)';
  }
}

// 로딩 토글
function setLoading(isLoading) {
  if (isLoading) {
    loadingSpinner.classList.remove('hidden');
  } else {
    loadingSpinner.classList.add('hidden');
  }
}

// 할 일 목록 조회 (Read)
async function fetchTodos() {
  setLoading(true);

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('todos')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Supabase 데이터 조회 오류:', error);
        alert(`데이터 조회 실패: ${error.message}\n(schema.sql을 Supabase SQL Editor에서 실행했는지 확인해 주세요)`);
      } else {
        todos = data || [];
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    // 로컬 스토리지 폴백
    const localData = localStorage.getItem('local_todos');
    todos = localData ? JSON.parse(localData) : [];
  }

  setLoading(false);
  renderTodos();
}

// 할 일 추가 (Create)
async function addTodo(title) {
  if (supabaseClient) {
    setLoading(true);
    const { data, error } = await supabaseClient
      .from('todos')
      .insert([{ title, is_completed: false }])
      .select();

    setLoading(false);
    if (error) {
      alert(`추가 실패: ${error.message}`);
      return;
    }
    if (data && data.length > 0) {
      todos.unshift(data[0]);
      renderTodos();
    }
  } else {
    const newTodo = {
      id: Date.now(),
      title,
      is_completed: false,
      created_at: new Date().toISOString()
    };
    todos.unshift(newTodo);
    saveLocalTodos();
    renderTodos();
  }
}

// 상태 변경 (Update)
async function toggleTodo(id, currentStatus) {
  const newStatus = !currentStatus;

  if (supabaseClient) {
    const { error } = await supabaseClient
      .from('todos')
      .update({ is_completed: newStatus })
      .eq('id', id);

    if (error) {
      alert(`수정 실패: ${error.message}`);
      return;
    }
    todos = todos.map(t => t.id === id ? { ...t, is_completed: newStatus } : t);
    renderTodos();
  } else {
    todos = todos.map(t => t.id === id ? { ...t, is_completed: newStatus } : t);
    saveLocalTodos();
    renderTodos();
  }
}

// 할 일 삭제 (Delete)
async function deleteTodo(id) {
  if (supabaseClient) {
    const { error } = await supabaseClient
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      alert(`삭제 실패: ${error.message}`);
      return;
    }
    todos = todos.filter(t => t.id !== id);
    renderTodos();
  } else {
    todos = todos.filter(t => t.id !== id);
    saveLocalTodos();
    renderTodos();
  }
}

function saveLocalTodos() {
  localStorage.setItem('local_todos', JSON.stringify(todos));
}

// 화면 렌더링
function renderTodos() {
  todoList.innerHTML = '';

  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.is_completed;
    if (currentFilter === 'completed') return todo.is_completed;
    return true;
  });

  if (filteredTodos.length === 0) {
    todoList.innerHTML = `<li style="text-align: center; color: var(--text-muted); padding: 20px;">표시할 항목이 없습니다.</li>`;
  } else {
    filteredTodos.forEach(todo => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.is_completed ? 'completed' : ''}`;

      li.innerHTML = `
        <div class="todo-content">
          <input type="checkbox" class="todo-checkbox" ${todo.is_completed ? 'checked' : ''} />
          <span class="todo-title">${escapeHtml(todo.title)}</span>
        </div>
        <button class="btn-delete" title="삭제">&times;</button>
      `;

      // 체크박스 / 항목 클릭 토글
      const checkbox = li.querySelector('.todo-checkbox');
      checkbox.addEventListener('change', () => toggleTodo(todo.id, todo.is_completed));

      // 삭제 버튼 클릭
      const btnDelete = li.querySelector('.btn-delete');
      btnDelete.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTodo(todo.id);
      });

      todoList.appendChild(li);
    });
  }

  // 개수 갱신
  const activeCount = todos.filter(t => !t.is_completed).length;
  todoCount.textContent = `${activeCount}개 진행 중 / 총 ${todos.length}개`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
