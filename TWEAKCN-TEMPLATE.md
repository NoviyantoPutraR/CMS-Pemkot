# TweakCN Clean Slate Template

Dokumentasi template konfigurasi TweakCN Clean Slate untuk project SiCMS.

## File Template

Project ini menyimpan template konfigurasi TweakCN Clean Slate di file berikut:

1. **`tweakcn-template.css`** - Template CSS variables untuk light dan dark mode
2. **`tailwind.config.template.ts`** - Template konfigurasi Tailwind CSS

## Cara Menggunakan Template

### Untuk Agent Cursor

Ketika user meminta untuk menerapkan template TweakCN Clean Slate, ikuti langkah berikut:

1. **Baca file template:**
   - Baca `tweakcn-template.css` untuk mendapatkan CSS variables
   - Baca `tailwind.config.template.ts` untuk mendapatkan konfigurasi Tailwind

2. **Terapkan ke file yang sesuai:**
   - **CSS Variables:** Tambahkan atau update CSS variables di `src/index.css` dalam `@layer base { :root { ... } }` dan `.dark { ... }`
   - **Tailwind Config:** Update `tailwind.config.js` dengan menambahkan konfigurasi dari template ke dalam `theme.extend`

3. **Pertahankan konfigurasi yang sudah ada:**
   - Jangan hapus konfigurasi custom yang sudah ada (seperti Design.json integration, custom spacing, fontSize, dll)
   - Hanya tambahkan atau update bagian yang relevan dengan template TweakCN

### Struktur Penerapan

#### Di `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Copy semua CSS variables dari tweakcn-template.css */
    --background: rgb(248, 250, 252);
    /* ... dst */
  }

  .dark {
    /* Copy semua CSS variables untuk dark mode dari tweakcn-template.css */
    --background: rgb(15, 23, 42);
    /* ... dst */
  }
}
```

#### Di `tailwind.config.js`:

Tambahkan konfigurasi dari `tailwind.config.template.ts` ke dalam `theme.extend`, sambil mempertahankan konfigurasi yang sudah ada:

```javascript
export default {
  darkMode: ["class"],
  content: [/* ... existing content ... */],
  theme: {
    extend: {
      colors: {
        // Tambahkan colors dari template
        border: "var(--border)",
        // ... dst
        
        // Pertahankan custom colors yang sudah ada
        'primary-blue': { /* ... */ },
        // ... dst
      },
      borderRadius: {
        // Tambahkan dari template
        xl: "calc(var(--radius) + 4px)",
        // ... dst
        
        // Pertahankan custom borderRadius yang sudah ada
        card: '0.75rem',
        // ... dst
      },
      fontFamily: {
        // Tambahkan dari template
        sans: ["var(--font-sans)"],
        // ... dst
        
        // Pertahankan custom fontFamily yang sudah ada
        poppins: ['Poppins', 'sans-serif'],
        // ... dst
      },
      // Pertahankan semua custom extensions lainnya
      spacing: { /* ... */ },
      fontSize: { /* ... */ },
      boxShadow: { /* ... */ },
      // ... dst
    },
  },
  plugins: [],
}
```

## Catatan Penting

- Template ini adalah **referensi standar** TweakCN Clean Slate
- Project ini sudah memiliki konfigurasi custom yang perlu **dipertahankan**
- Saat menerapkan template, **merge** dengan konfigurasi yang sudah ada, jangan replace
- File template ini **tidak digunakan langsung** oleh aplikasi, hanya sebagai referensi

## Kapan Menggunakan Template

Gunakan template ini ketika:
- User meminta untuk "menerapkan template tweakcn"
- User meminta untuk "reset ke template clean slate"
- User meminta untuk "update ke versi terbaru tweakcn"
- Ada masalah dengan konfigurasi dan perlu referensi standar

## Referensi

- [TweakCN Documentation](https://tweakcn.com)
- File template: `tweakcn-template.css` dan `tailwind.config.template.ts`

