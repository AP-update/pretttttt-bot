🤖 Prettttttt-Bot Base
<p align="center">
<b>Base Telegram Bot Modular • Dibangun dengan Node.js (ESM)</b>

⚡ Ringan, cepat, dan siap dikembangkan jadi bot Telegram pribadi kamu!
</p>
<p align="center">
<img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=flat-square&logo=node.js" />
<img src="https://img.shields.io/badge/Telegram%20Bot-API-blue?style=flat-square&logo=telegram" />
<img src="https://img-url.com/license-mit" />
</p>
🧩 Struktur Folder
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

⚙️ Tentang Proyek
Prettttttt-Bot adalah base bot Telegram modular berbasis Node.js (ESM).
Struktur file-nya dibuat rapi dan dipisahkan per kategori agar mudah dikembangkan.
> 💡 Tujuan: Menjadi pondasi ringan dan fleksibel untuk membuat bot Telegram kamu sendiri.
> 
🚀 Panduan Instalasi Lengkap di Termux (Dari Nol)
Panduan ini cocok untuk pemula total, mulai dari install Termux, clone repository, pindahkan ke internal, sampai bot aktif. Kita akan menjalankan bot dari folder /storage/emulated/0/Download/Prettttttt-Bot di memori internal.
1. 📲 Instal Termux
Unduh Termux dari sumber resmi:
 * Play Store
 * F-Droid (disarankan)
> 💡 Disarankan: Gunakan versi F-Droid karena lebih stabil untuk Node.js dan penyimpanan internal.
> 
2. ⚙️ Persiapan Awal Termux
Buka Termux dan jalankan perintah berikut satu per satu:
pkg update -y && pkg upgrade -y
termux-setup-storage

> Saat muncul permintaan izin penyimpanan, pilih Izinkan ✅
> 
3. 📦 Instal Dependensi Utama
Instal paket yang diperlukan untuk menjalankan bot:
pkg install nodejs git nano unzip -y

Penjelasan:
 * Node.js → untuk menjalankan bot
 * Git → untuk meng-clone repository
 * Nano → untuk mengedit file langsung dari Termux
 * Unzip → untuk ekstrak file ZIP (jika kamu tidak clone repo)
4. 📂 Clone Repository Bot
Clone repository langsung ke Termux (ganti username dengan nama pengguna repository yang benar):
git clone https://github.com/username/prettttttt-bot.git

Setelah selesai, pindahkan folder-nya ke penyimpanan internal agar mudah diakses:
mv prettttttt-bot /storage/emulated/0/Download/

> Lokasi folder kamu sekarang: /storage/emulated/0/Download/prettttttt-bot
> 
5. 📁 Masuk ke Folder Project
Arahkan ke folder project yang baru dipindahkan:
cd /storage/emulated/0/Download/prettttttt-bot

6. ⚡ Instal Semua Module Node.js
Masih di dalam folder project, jalankan:
npm install

> Ini akan menginstal semua module yang terdaftar di package.json.
> 
7. 🔧 Konfigurasi Bot
Edit file config.js untuk menambahkan token bot dan ID kamu:
nano config.js

Isi seperti contoh di bawah (ganti dengan Token dan ID milikmu):
export const BOT_TOKEN = 'ISI_TOKEN_BOT_KAMU';
export const OWNER_ID = '123456789';
export const ADMINS = ['123456789'];

Cara Menyimpan di Nano:
 * Tekan CTRL + X
 * Ketik Y (untuk Yes)
 * Tekan Enter
📬 Cara Mendapatkan Token & ID Telegram
🔹 Cara Dapatkan Token Bot dari @BotFather
 * Buka Telegram dan cari @BotFather.
 * Ketik /start lalu /newbot.
 * Ikuti instruksi dan dapatkan token.
 * Contoh Token: 1234567890:ABCdefGhijkLmnoPQRstuVWxyz
 * Salin token itu dan tempel ke config.js pada BOT_TOKEN.
🔹 Cara Dapatkan ID Telegram Kamu
 * Buka Telegram dan cari bot @userinfobot (atau bot sejenis).
 * Ketik /start.
 * Bot akan membalas ID kamu, contoh: Your ID: 987654321.
 * Gunakan angka ID tersebut untuk OWNER_ID dan ADMINS di config.js.
8. 🚀 Jalankan Bot
Masih di folder project, jalankan bot dengan:
node index.js

Jika berhasil, akan muncul log seperti: ✅ Bot is now running...
> Sekarang buka Telegram, cari bot kamu (sesuai nama bot yang dibuat), dan kirim /menu. Jika bot membalas, artinya Prettttttt-Bot sudah berjalan 🎉.
> 
9. ♻️ Menjalankan Bot 24 Jam (Opsional)
Gunakan PM2 agar bot tetap aktif meski Termux ditutup:
Instal PM2:
npm install -g pm2

Jalankan Bot dengan PM2:
pm2 start index.js --name "prettttttt-bot"
pm2 save

Cek Status:
pm2 list

Hentikan Bot:
pm2 stop prettttttt-bot

🧠 Tips Developer
 * 🧩 Tambahkan fitur baru dengan menaruh file di folder commands/.
 * 🔁 Gunakan utils/reload.js untuk reload command tanpa restart.
 * 🎨 Ubah tampilan menu di utils/menu.js.
 * 🧍 Semua data pengguna disimpan di users.json.
 * ⚙️ Struktur modular memudahkan debugging & pengembangan.
💻 Teknologi yang Digunakan
 * Node.js (ESM)
 * Telegram Bot API
 * Axios / Fetch
 * PM2 (opsional, untuk keep-alive)
 * JSON Storage (users.json)
⚡ Lisensi
Proyek ini menggunakan MIT License.
