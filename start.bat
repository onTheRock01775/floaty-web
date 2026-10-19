@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo ไม่พบ Node.js กรุณาติดตั้ง Node.js ก่อนเปิดเว็บ
  pause
  exit /b 1
)
echo เปิดเว็บที่ http://127.0.0.1:4173 หลังเห็นข้อความ Floaty preview
echo ปิดหน้าต่างนี้ หรือกด Ctrl+C เพื่อหยุดเว็บ
node server.mjs
if errorlevel 1 pause
