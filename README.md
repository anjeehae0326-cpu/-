# Git 설치 및 한국어 환경 설정 요약

## 1. Git 설치 현황
- **버전**: `Git for Windows 2.56.0.windows.2`
- **설치 위치**: `C:\Program Files\Git\cmd\git.exe`

## 2. 한국어 환경 설정
Git 명령어 및 안내 메시지를 한국어로 출력하기 위한 설정:

- **임시 설정 (현재 세션)**:
  ```powershell
  $env:LC_ALL = "ko_KR.UTF-8"
  ```
- **영구 설정**:
  ```powershell
  setx LC_ALL "ko_KR.UTF-8"
  ```
