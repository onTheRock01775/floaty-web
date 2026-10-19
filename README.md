# Floaty download website

เว็บดาวน์โหลด Floaty ภาษาไทย โทนสว่างและม่วง พร้อม MacBook demo ที่สลับ Layout ได้, ตัวอย่าง PIN, ตัวเลื่อนความโปร่งใส, scroll reveal, FAQ animation และ reduced-motion support

## เปิดดูบนเครื่อง

ต้องมี Node.js ไม่ต้องติดตั้ง dependencies

ดับเบิลคลิก `start.bat` แล้วเปิด http://127.0.0.1:4173 หรือใช้คำสั่ง:

```powershell
cd E:\program-game\roo-pin-web
npm run dev
```

เปิด http://127.0.0.1:4173 หาก port ไม่ว่าง ใช้ `$env:PORT = '4174'` ก่อนรัน

`npm run check` ตรวจ syntax JavaScript

## ดาวน์โหลดและเวอร์ชัน

ปุ่มดาวน์โหลดใช้ GitHub Releases ของ `onTheRock01775/floaty` และอ่าน stable release ล่าสุดจาก public GitHub API โดยไม่ใช้ token เมื่อ API ใช้ไม่ได้ ปุ่มยังลิงก์ไป `/releases/latest/download/Floaty.exe` ได้ตามเดิม

หน้าเว็บแจก `Floaty.exe` ไฟล์เดียว โดยมีตัวช่วยอัปเดตฝังภายใน ส่วน `Floaty-windows.zip` ยังคงไว้สำหรับระบบ updater ของแอปรุ่นเก่า ตัวเลขเวอร์ชันและขนาดไฟล์บนหน้าเว็บอ่านจาก Release จริง ไม่ได้ตั้งให้เป็นเวอร์ชันที่ยังไม่เผยแพร่

## เผยแพร่เว็บ

เว็บเป็น static HTML/CSS/JS ใช้ GitHub Pages, Cloudflare Pages หรือ static hosting อื่นได้ โดยตั้ง publish directory เป็นโฟลเดอร์นี้และไม่ต้องมี build command ต้องนำ `index.html`, `styles.css`, `app.js` และ `assets/` ขึ้นด้วยกัน ใช้ relative asset paths รองรับการวางใน subpath

ซอร์สโค้ดอยู่ที่ [onTheRock01775/floaty-web](https://github.com/onTheRock01775/floaty-web)

การ push ซอร์สขึ้น repository ยังไม่ใช่การเปิด hosting ต้องตั้งค่า GitHub Pages หรือ static hosting แยกก่อนจึงจะมี URL สาธารณะ

## ฟอนต์และภาพ

ใช้ IBM Plex Sans Thai Looped ที่มากับโปรเจกต์เดิม เก็บใบอนุญาต OFL ไว้ที่ `assets/fonts/OFL.txt` ภาพหน้าต่างและ MacBook เป็นภาพจำลองด้วย CSS และ SVG ไม่มีการส่งข้อมูลหน้าต่างจริงของผู้ใช้ขึ้นเว็บ
