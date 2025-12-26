# Landing Page Design Standards

Dokumentasi standar design global untuk landing page. Gunakan sebagai referensi saat mengembangkan atau memperbaiki section landing page.

## Table of Contents

1. [Spacing & Padding](#spacing--padding)
2. [Container & Max-Width](#container--max-width)
3. [Typography](#typography)
4. [Buttons & CTAs](#buttons--ctas)
5. [Grid Systems](#grid-systems)
6. [Breakpoints](#breakpoints)
7. [Background & Section Alternation](#background--section-alternation)
8. [Utility Classes](#utility-classes)

---

## Spacing & Padding

### Section Padding (Vertical)

**Standard Pattern:**
```css
py-12 sm:py-16 lg:py-20
```

- **Mobile (< 640px)**: `py-12` (3rem / 48px)
- **Tablet (640px - 1023px)**: `py-16` (4rem / 64px)
- **Desktop (≥ 1024px)**: `py-20` (5rem / 80px)

**Utility Class:** `.section-padding`

**Pengecualian:**
- **Hero Section**: `pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20` (lebih besar untuk impact)
  - Utility Class: `.hero-padding`
- **Footer**: `pt-16 pb-10` (tidak menggunakan section padding standard)

### Section Padding (Horizontal)

**Standard Pattern:**
```css
px-4 sm:px-6 lg:px-8
```

- **Mobile**: `px-4` (1rem / 16px)
- **Tablet**: `px-6` (1.5rem / 24px)
- **Desktop**: `px-8` (2rem / 32px)

**Utility Class:** Include dalam `.section-container`

---

## Container & Max-Width

### Standard Container

**Pattern:**
```css
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

- **Max Width**: `max-w-7xl` (1280px)
- **Centering**: `mx-auto`
- **Padding**: Sesuai section padding horizontal

**Utility Class:** `.section-container`

**Catatan:** Semua section (termasuk Footer) harus menggunakan container ini untuk konsistensi alignment.

---

## Typography

### Hero Title (H1)

**Pattern:**
```css
text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight
```

- **Mobile**: `text-3xl` (1.875rem / 30px)
- **Tablet**: `text-4xl` (2.25rem / 36px)
- **Desktop**: `text-5xl` (3rem / 48px)
- **Weight**: `font-bold` (700)
- **Line Height**: `leading-tight` (1.25)

**Utility Class:** `.heading-hero`

### Section Heading (H2)

**Pattern:**
```css
text-2xl lg:text-3xl font-bold leading-tight
```

- **Mobile**: `text-2xl` (1.5rem / 24px)
- **Desktop**: `text-3xl` (1.875rem / 30px)
- **Weight**: `font-bold` (700)
- **Line Height**: `leading-tight` (1.25)

**Utility Class:** `.heading-section`

### Subsection Heading (H3)

**Pattern:**
```css
text-xl lg:text-2xl font-semibold leading-snug
```

- **Mobile**: `text-xl` (1.25rem / 20px)
- **Desktop**: `text-2xl` (1.5rem / 24px)
- **Weight**: `font-semibold` (600)
- **Line Height**: `leading-snug` (1.375)

**Utility Class:** `.heading-subsection`

### Card Title (H4)

**Pattern:**
```css
text-lg font-semibold leading-snug
```

- **Size**: `text-lg` (1.125rem / 18px)
- **Weight**: `font-semibold` (600)
- **Line Height**: `leading-snug` (1.375)

**Utility Class:** `.heading-card`

### Body Text

**Base:**
```css
text-base font-normal leading-relaxed
```
- **Size**: `text-base` (1rem / 16px)
- **Weight**: `font-normal` (400)
- **Line Height**: `leading-relaxed` (1.625)

**Utility Class:** `.text-body`

**Small:**
```css
text-sm font-normal leading-relaxed
```
- **Size**: `text-sm` (0.875rem / 14px)

**Utility Class:** `.text-body-sm`

**Extra Small:**
```css
text-xs font-normal leading-relaxed
```
- **Size**: `text-xs` (0.75rem / 12px)

**Utility Class:** `.text-body-xs`

### Font Family

- **Primary**: Poppins (sudah di-set di body)
- Gunakan `font-poppins` jika perlu eksplisit, atau inherit dari body

### Aturan Typography

1. Jangan campur font-weight secara acak
2. Gunakan line-height yang sesuai dengan size
3. Ikuti hierarchy: Hero > Section > Subsection > Card > Body
4. Konsistensi lebih penting daripada variasi

---

## Buttons & CTAs

### Primary Button

**Pattern:**
```css
bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:bg-blue-700
```

- **Background**: `bg-blue-600`
- **Text**: `text-white`
- **Padding**: `px-6 py-3`
- **Border Radius**: `rounded-full` (pill shape)
- **Font**: `text-sm font-medium`
- **Hover**: `hover:bg-blue-700`
- **Transition**: `transition-all duration-300`

**Utility Class:** `.btn-primary`

**Alternative:** Gunakan `bg-primary-blue` (dari Design.json #0052FF) jika diperlukan

### Secondary Button

**Pattern:**
```css
bg-yellow-400 text-blue-900 px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200 hover:bg-yellow-300
```

- **Background**: `bg-yellow-400`
- **Text**: `text-blue-900`
- **Padding**: `px-6 py-2`
- **Border Radius**: `rounded-full`
- **Font**: `text-sm font-semibold`
- **Hover**: `hover:bg-yellow-300`
- **Transition**: `transition-colors duration-200`

**Utility Class:** `.btn-secondary`

**Alternative:** Gunakan `bg-secondary-yellow` (dari Design.json #FFD700) jika diperlukan

### Text Link (CTA)

**Pattern:**
```css
text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors duration-200
```

- **Text**: `text-blue-600`
- **Font**: `text-sm font-medium`
- **Hover**: `hover:text-blue-800`
- **No background, no padding khusus**
- Optional: Tambahkan arrow icon (→) untuk clarity

**Utility Class:** `.btn-text-link`

### Aturan Button

1. Gunakan salah satu dari 3 style di atas
2. **Jangan membuat custom button style baru**
3. Konsistensi lebih penting daripada variasi
4. Hero button bisa tetap menggunakan style khusus (gradient animation) karena unique positioning, tapi harus mengikuti padding dan sizing standard

---

## Grid Systems

### Card Grid

**Pattern:**
```css
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6
```

- **Mobile**: 1 kolom
- **Tablet**: 2 kolom
- **Desktop**: 4 kolom
- **Gap**: `gap-6` (1.5rem / 24px)

**Utility Class:** `.grid-cards`

**Alternatives:**
- 3 kolom di desktop: `lg:grid-cols-3` (untuk content density lebih rendah)
- 6 kolom di desktop: `lg:grid-cols-6` (untuk cards kecil)

### Content Split Grid

**Pattern:**
```css
grid grid-cols-1 lg:grid-cols-2 gap-8
```

- **Mobile/Tablet**: 1 kolom (stacked)
- **Desktop**: 2 kolom (split)
- **Gap**: `gap-8` (2rem / 32px)

**Utility Class:** `.grid-content-split`

### Complex Layout (12-Column System)

**Pattern:**
```css
grid grid-cols-1 lg:grid-cols-12 gap-6
```

- **Mobile/Tablet**: 1 kolom
- **Desktop**: 12 kolom (untuk complex layouts dengan custom splits)
- **Gap**: `gap-6` (1.5rem / 24px)

**Utility Class:** `.grid-complex`

**Example Usage:**
```jsx
<div className="grid-complex">
  <div className="lg:col-span-3">Left Panel (25%)</div>
  <div className="lg:col-span-9">Right Content (75%)</div>
</div>
```

### Gap Standards

- **Cards**: `gap-6` (1.5rem / 24px)
- **Content sections**: `gap-8` (2rem / 32px)
- **Tight spacing**: `gap-4` (1rem / 16px) - jarang digunakan

---

## Breakpoints

### Tailwind Default Breakpoints

- **sm**: 640px (mobile landscape / small tablet)
- **md**: 768px (tablet)
- **lg**: 1024px (laptop / desktop)
- **xl**: 1280px (large desktop)
- **2xl**: 1536px (extra large desktop)

### Mobile First Approach

- **Base styles**: Untuk mobile (< 640px)
- **sm:** Mobile landscape / tablet kecil
- **md:** Tablet portrait
- **lg:** Desktop (breakpoint utama)
- **xl:** Large desktop (opsional, jarang digunakan)

### Testing Breakpoints

Pastikan test di:
- **360px**: Mobile kecil (iPhone SE, dll)
- **640px**: Mobile landscape / Tablet kecil
- **768px**: Tablet portrait
- **1024px**: Laptop / Desktop
- **1280px**: Desktop besar
- **1920px**: Extra large desktop

---

## Background & Section Alternation

### Background Pattern

**Section Sequence:**
1. **Hero**: Gradient background (tetap)
2. **Highlight News**: White dengan subtle gradient overlay
3. **Tabs + Services**: White dengan subtle gradient overlay
4. **Transparency**: `bg-blue-800` (dark blue)
5. **Vision**: `bg-[#F8F9FA]` atau `bg-gray-50` (light gray)
6. **Quick Access**: `bg-blue-800` (dark blue) - matching dengan Transparency
7. **Footer**: `bg-blue-900` (darker blue)

### Alternating Pattern

- **Light sections**: White / Light gray
- **Dark sections**: Blue-800
- **Pattern**: Light → Light → Dark → Light → Dark

### Section Boundaries

- Gunakan spacing yang jelas antar section berbeda background
- Pastikan text color kontras:
  - **White text** di dark background (`bg-blue-800`, `bg-blue-900`)
  - **Dark text** di light background (white, gray-50)

---

## Utility Classes

Semua utility classes tersedia di `src/index.css` dalam `@layer components`.

### Section Utilities
- `.section-container` - Container dengan max-width dan padding standard
- `.section-padding` - Padding vertical section standard
- `.hero-padding` - Padding khusus untuk hero section

### Typography Utilities
- `.heading-hero` - Hero title (H1)
- `.heading-section` - Section heading (H2)
- `.heading-subsection` - Subsection heading (H3)
- `.heading-card` - Card title (H4)
- `.text-body` - Body text base
- `.text-body-sm` - Body text small
- `.text-body-xs` - Body text extra small

### Button Utilities
- `.btn-primary` - Primary button (blue)
- `.btn-secondary` - Secondary button (yellow)
- `.btn-text-link` - Text link CTA

### Grid Utilities
- `.grid-cards` - Card grid (1/2/4 columns)
- `.grid-content-split` - Content split grid (1/2 columns)
- `.grid-complex` - Complex 12-column grid

### Usage Example

```jsx
<section className="section-padding bg-white">
  <div className="section-container">
    <h2 className="heading-section mb-8">Section Title</h2>
    <div className="grid-cards">
      {/* Cards here */}
    </div>
    <button className="btn-primary mt-8">Primary Action</button>
  </div>
</section>
```

---

## Checklist Implementasi

Saat mengimplementasikan atau memperbaiki section, pastikan:

### Spacing & Layout
- [ ] Menggunakan `.section-container` atau pattern `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- [ ] Menggunakan `.section-padding` atau pattern `py-12 sm:py-16 lg:py-20`
- [ ] Gap dalam grid konsisten (`gap-6` untuk cards, `gap-8` untuk content)

### Typography
- [ ] Menggunakan utility class typography atau pattern yang sesuai
- [ ] Font weight konsisten (bold untuk headings, normal untuk body)
- [ ] Line height sesuai dengan size

### Buttons
- [ ] Menggunakan salah satu dari 3 button styles (primary, secondary, text link)
- [ ] Tidak membuat custom button style baru
- [ ] Hover states konsisten

### Grid
- [ ] Menggunakan utility class grid atau pattern yang standar
- [ ] Breakpoint behavior jelas dan konsisten
- [ ] Alignment seragam dengan section lain

### Responsiveness
- [ ] Test di 360px, 640px, 768px, 1024px, 1280px
- [ ] Tidak ada horizontal scroll
- [ ] Content readable di semua breakpoints

---

## File Reference

- **Utility Classes**: `src/index.css` (dalam `@layer components`)
- **Design Tokens**: `Design.json`
- **Tailwind Config**: `tailwind.config.js`
- **Audit Report**: `landing-page-global-design-audit.plan.md`

---

**Last Updated**: 2024
**Version**: 1.0

