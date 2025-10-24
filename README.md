
---

<h1 align="center">🤖 Prettttttt-Bot Base</h1>

<p align="center">
  <b>Base Telegram Bot Modular • Dibangun dengan Node.js (ESM)</b><br>
  ⚡ Ringan, cepat, dan siap dikembangkan jadi bot Telegram pribadi kamu!
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=flat-square&logo=node.js" />
  <img src="https://img.shields.io/badge/Telegram%20Bot-API-blue?style=flat-square&logo=telegram" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
</p>

---

## 🧩 Struktur Folder

Prettttttt-Bot/
├── commands/
│   ├── admin/
│   │   └── broadcast.js
│   ├── Ai/
│   │   └── felo.js
│   ├── Downloader/
│   │   ├── igdl.js
│   │   └── ttdl.js
│   ├── fun/
│   │   └── fun.js
│   ├── search/
│   │   └── lirik.js
│   └── tools/
│       └── ping.js
├── utils/
│   ├── menu.js
│   └── reload.js
├── config.js
├── index.js
├── package.json
└── users.json

---

## ⚙️ Tentang Proyek

**Prettttttt-Bot** adalah base bot Telegram modular berbasis **Node.js (ESM)**.  
Struktur file-nya dibuat rapi dan dipisahkan per kategori agar mudah dikembangkan.

> 💡 Tujuan: Menjadi pondasi ringan dan fleksibel untuk membuat bot Telegram kamu sendiri.

---

## 🚀 Panduan Instalasi Lengkap di Termux (Dari Nol)

Panduan ini cocok untuk **pemula total**, mulai dari install Termux, clone repository, pindahkan ke internal, sampai bot aktif.  
Kita akan menjalankan bot dari folder **Download/Prettttttt-Bot** di memori internal.

---

### 1. 📲 Instal Termux

Unduh Termux dari sumber resmi:

- [Play Store](https://play.google.com/store/apps/details?id=com.termux)
- [F-Droid (disarankan)](https://f-droid.org/en/packages/com.termux/)

> 💡 Disarankan gunakan versi **F-Droid** karena lebih stabil untuk Node.js dan penyimpanan internal.

---

### 2. ⚙️ Persiapan Awal Termux

Buka Termux dan jalankan perintah berikut satu per satu:

```bash
pkg update -y && pkg upgrade -y
termux-setup-storage

> Saat muncul permintaan izin penyimpanan, pilih Izinkan ✅




---

3. 📦 Instal Dependensi Utama

pkg install nodejs git nano unzip -y

Penjelasan:

Node.js → untuk menjalankan bot

Git → untuk meng-clone repository

Nano → untuk mengedit file langsung dari Termux

Unzip → untuk ekstrak file ZIP jika kamu tidak clone repo



---

4. 📂 Clone Repository Bot

Clone repository langsung ke Termux:

git clone https://github.com/username/prettttttt-bot.git

Setelah proses clone selesai, pindahkan folder-nya ke penyimpanan internal agar bisa diakses:

mv prettttttt-bot /storage/emulated/0/Download/

Sekarang folder kamu ada di:

/storage/emulated/0/Download/prettttttt-bot


---

5. 📁 Masuk ke Folder Project

Arahkan ke folder project:

cd /storage/emulated/0/Download/prettttttt-bot


---

6. ⚡ Instal Semua Module Node.js

Masih di dalam folder project, jalankan:

npm install

> Ini akan menginstal semua module dari package.json seperti axios, node-telegram-bot-api, dan lainnya.




---

7. 🔧 Konfigurasi Bot

Edit file config.js untuk menambahkan token bot dan ID kamu:

nano config.js

Isi seperti ini:

export const BOT_TOKEN = 'ISI_TOKEN_BOT_KAMU';
export const OWNER_ID = '123456789';
export const ADMINS = ['123456789'];

Lalu tekan:

CTRL + X

Ketik Y

Tekan Enter



---

📬 Cara Mendapatkan Token & ID Telegram

🔹 Cara Dapatkan Token Bot dari @BotFather

1. Buka Telegram dan cari @BotFather


2. Ketik /start lalu /newbot


3. Ikuti instruksi — beri nama bot kamu (bebas) dan username bot (harus diakhiri dengan bot, contoh: prettttttt_bot)


4. Setelah selesai, BotFather akan mengirim pesan seperti ini:



Done! Congratulations on your new bot.
You will find it at t.me/prettttttt_bot.
Use this token to access the HTTP API:
1234567890:ABCdefGhijkLmnoPQRstuVWxyz

5. Salin token itu dan tempel ke file config.js di bagian:

export const BOT_TOKEN = '1234567890:ABCdefGhijkLmnoPQRstuVWxyz';




---

🔹 Cara Dapatkan ID Telegram Kamu

1. Buka Telegram dan cari bot @userinfobot


2. Ketik /start


3. Bot akan membalas seperti:

Your ID: 987654321


4. Gunakan angka itu untuk OWNER_ID dan ADMINS di config.js.




---

8. 🚀 Jalankan Bot

Masih di folder project:

node index.js

Jika berhasil, akan muncul log seperti:

✅ Bot is now running...

Sekarang buka Telegram, cari bot kamu (contoh: @prettttttt_bot) sesuai nama bot yg tadi kamu buat, dan kirim:

/menu

Jika bot membalas, artinya Prettttttt-Bot sudah berjalan 🎉


---

9. ♻️ Menjalankan Bot 24 Jam (Opsional)

Kalau kamu ingin bot tetap aktif meski Termux ditutup:

npm install -g pm2
pm2 start index.js --name "prettttttt-bot"
pm2 save

Cek status bot:

pm2 list

Hentikan bot:

pm2 stop prettttttt-bot


---

🧠 Tips Developer

🧩 Tambahkan fitur baru dengan menaruh file di folder commands/

🔁 Gunakan utils/reload.js untuk reload command tanpa restart

🎨 Ubah tampilan menu di utils/menu.js

🧍 Semua data pengguna disimpan di users.json

⚙️ Struktur modular memudahkan debugging & pengembangan



---

💻 Teknologi yang Digunakan

Node.js (ESM)

Telegram Bot API

Axios / Fetch

PM2 (opsional, untuk keep-alive)

JSON Storage (users.json)


---

---

⚡ Lisensi

Proyek ini menggunakan MIT License
Kamu bebas menggunakan, memodifikasi, dan menyebarkan ulang dengan tetap mencantumkan kredit.


---
