# SOC / Blue Team Portfolio — Next.js

Hacker-theme, SOC-console-styled portfolio site. Sab kuch data-driven hai — theme
ek "Security Operations Center console" jaisi dikhti hai (terminal windows,
alert feed, incident-report style project cards), jo directly tumhare Blue Team
background se match karti hai.

## 🚀 Local mein chalane ke liye

```bash
npm install
npm run dev
```
Phir browser mein `http://localhost:3000` kholo.

## ✏️ Apna content daalna (SABSE ZAROORI STEP)

Poora content ek hi file mein hai:

```
src/data/content.ts
```

Is file mein edit karo:
- `profile` → naam, role, email, GitHub/LinkedIn/TryHackMe links, tagline, summary
- `projects` → apne 5 projects (already tumhare diye hue data se pre-filled hain)
- `skillCategories` → tools aur unka proficiency level (0–100)
- `certifications` → tumhari certs
- `threatFeed` → hero section ke live-alert-ticker ke liye sample lines (ye sirf
  visual demo hai, "simulated" label ke sath — real feed nahi)

Baaki koi file touch karne ki zaroorat nahi.

## 📄 Apna CV lagana

`public/resume.pdf` ko apni asli CV se replace kar do (same filename rakhna).
Abhi ek placeholder PDF laga hua hai jo "Download CV" button pe click karne se
milta hai.

## 🎨 Design system (agar colors/fonts change karne hain)

Sab design tokens `src/app/globals.css` ke `:root` mein hain:
- `--accent` → phosphor green (main accent)
- `--amber` → warning/severity color
- `--red` → critical severity color
- Fonts: JetBrains Mono (headings/data) + IBM Plex Sans (body) — self-hosted
  via `@fontsource`, koi external network call nahi hoti build ke waqt.

## 📁 Structure

```
src/
  app/
    layout.tsx       → fonts + metadata
    page.tsx          → sections assemble
    globals.css        → design tokens + theme
  components/
    StatusBar.tsx      → top live-status strip
    Nav.tsx             → sticky navbar
    Hero.tsx            → terminal boot animation + CV button
    ThreatFeed.tsx      → simulated alert ticker (signature element)
    About.tsx
    Skills.tsx           → tool inventory with proficiency bars
    Projects.tsx          → incident-report style project cards
    Certifications.tsx     → clearance-badge style certs
    Contact.tsx
    Footer.tsx
  data/
    content.ts          → ALL editable content lives here
```

## 🌐 Deploy karna (free options)

### Option A — Vercel (sabse aasan, Next.js ke creators khud hain)
1. Project ko GitHub pe push karo
2. vercel.com pe jao → "New Project" → apna repo import karo
3. Deploy click karo — 2 minute mein live ho jayega, free custom domain subdomain
   milega (yourname.vercel.app), apna custom domain bhi add kar sakte ho

### Option B — Netlify
1. GitHub pe push karo
2. Netlify pe "Import from Git" → build command: `npm run build`, publish dir:
   `.next` (Next.js plugin auto-detect ho jayega)

Dono free hain aur SOC/security recruiter ko bhejne ke liye ek clean live link
de dete hain.

## ✅ Pehle se ready hai
- Fully responsive (mobile → desktop)
- Keyboard focus visible (accessibility)
- prefers-reduced-motion respect karta hai
- Semantic HTML + proper heading structure (SEO friendly)

## 🔜 Aage kya add kar sakte ho
- Blog/writeups section (CTF writeups ke liye — pooch lena, add kar dunga)
- Google Analytics / Plausible
- Contact form backend (Formspree ya EmailJS — abhi mailto: link hai)
