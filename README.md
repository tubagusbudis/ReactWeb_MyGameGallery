# 🎮 Game Gallery

![Game Gallery Banner](assets/banner.png) **Game Gallery** adalah platform web interaktif yang dirancang khusus untuk para *gamers* agar bisa mengoleksi, membagikan, dan menemukan *screenshot* momen epik dari berbagai *game* favorit. Dibangun dengan antarmuka yang modern, responsif, dan dipenuhi animasi mulus ala *cyberpunk* / AAA game UI.

---

## ✨ Fitur Utama (Key Features)

* **🔐 Autentikasi Super Aman:** Sistem *Login*, *Register*, dan *Reset Password* terintegrasi langsung dengan Supabase Auth.
* **🖼️ Manajemen Konten (CRUD):** * **Create:** Upload *screenshot* game resolusi tinggi.
    * **Read:** Eksplorasi galeri dengan fitur *Search* dan *Filter* berdasarkan *Genre* (RPG, FPS, Action, dll).
    * **Update:** Edit judul, genre, deskripsi, atau ganti gambar kapan saja.
    * **Delete:** Hapus postingan dengan mudah.
* **🛡️ Role-Based Authorization:** *Row Level Security* (RLS) aktif. User hanya bisa mengedit dan menghapus konten milik mereka sendiri.
* **📥 Download & Share:** Simpan gambar orang lain ke *device* lo atau bagikan *link*-nya langsung ke *circle* lo.
* **✨ UI/UX & Animasi Premium:** * Efek *Floating Lines* interaktif di *background*.
    * Teks logo *TrueFocus* yang estetik.
    * Transisi modal dan *card* yang sangat mulus.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

Project ini dibangun menggunakan ekosistem *modern web development*:

* **Frontend Framework:** React.js (via Vite)
* **Styling:** Tailwind CSS
* **Backend as a Service (BaaS):** Supabase (Database, Auth, & Storage)
* **Animation Library:** Framer Motion
* **Icons:** Lucide React
* **UI Components:** React Bits (TrueFocus & FloatingLines)

---

## 🚀 Cara Menjalankan Project Secara Lokal (Getting Started)

Buat lo yang mau *clone* dan *run* project ini di komputer sendiri, ikutin langkah-langkah simpel di bawah ini.

### 1. Persyaratan (Prerequisites)
Pastikan lo udah *install*:
* [Node.js](https://nodejs.org/) (versi 16 atau terbaru)
* [Git](https://git-scm.com/)
* Akun [Supabase](https://supabase.com/)

### 2. Instalasi
Buka terminal dan jalankan perintah ini secara berurutan:

```bash
# Clone repository ini
git clone [https://github.com/](https://github.com/)[USERNAME_GITHUB_LO]/GameGallery.git

# Masuk ke folder project
cd GameGallery

# Install semua dependencies
npm install