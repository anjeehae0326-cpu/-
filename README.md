# 🚀 Git & GitHub 시작하기 가이드

Windows 환경에서 Git 설치, 한국어 로케일 설정 및 GitHub 원격 저장소 연동 과정을 정리한 가이드입니다.

---

## 📌 1. 환경 및 설치 정보
- **OS**: Windows
- **Git 버전**: `Git for Windows 2.56.0.windows.2`
- **Git 설치 경로**: `C:\Program Files\Git\cmd\git.exe`
- **원격 저장소**: [anjeehae0326-cpu/-](https://github.com/anjeehae0326-cpu/-)

---

## 🌐 2. Git 한국어(ko_KR) 로케일 설정

Git 명령어 도움말 및 메시지를 한국어로 출력하도록 설정하는 방법입니다.

### 🔹 현재 터미널 세션에만 적용
```powershell
$env:LC_ALL = "ko_KR.UTF-8"
```

### 🔹 시스템에 영구 적용
```powershell
setx LC_ALL "ko_KR.UTF-8"
```

> **참고**: 다시 영어로 변경하려면 `$env:LC_ALL = "en_US.UTF-8"` 또는 `setx LC_ALL "en_US.UTF-8"`을 실행합니다.

---

## 🔗 3. GitHub 원격 저장소 연동 및 인증

### 🔹 원격 저장소 연결
```bash
git remote add origin https://github.com/anjeehae0326-cpu/-.git
git branch -M main
```

### 🔹 Personal Access Token(PAT)을 활용한 인증
GitHub의 보안 정책으로 인해 비밀번호 대신 Personal Access Token을 사용합니다:
```bash
git remote set-url origin https://<USERNAME>:<TOKEN>@github.com/anjeehae0326-cpu/-.git
```

---

## 🛠️ 4. 자주 사용하는 기본 Git 명령어

| 작업 | 명령어 | 설명 |
| :--- | :--- | :--- |
| **상태 확인** | `git status` | 변경된 파일 목록 및 커밋 대기 상태 확인 |
| **변경사항 추가** | `git add .` | 모든 변경사항을 스테이징 영역에 추가 |
| **커밋 생성** | `git commit -m "메시지"` | 스테이징된 변경사항을 메시지와 함께 저장 |
| **원격 푸시** | `git push origin main` | 로컬 커밋을 GitHub 원격 저장소에 업로드 |
| **원격 풀** | `git pull origin main` | GitHub 최신 변경사항을 로컬로 가져오기 |
| **로그 조회** | `git log --oneline` | 커밋 히스토리를 한 줄씩 간략하게 확인 |

---
*Last updated: 2026-10-08*
