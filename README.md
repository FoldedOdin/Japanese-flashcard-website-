<div align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&size=36&pause=1000&color=F59E0B&center=true&vCenter=true&width=600&lines=NihongoFlash+🗾;Learn+Japanese+Kana;Hiragana+%26+Katakana+Flashcards" alt="NihongoFlash" />

<p align="center">
  <strong>A modern, accessible web app for mastering Japanese Hiragana & Katakana</strong><br/>
  through interactive flashcards, quizzes, and audio pronunciation.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-contributing">Contributing</a>
</p>

</div>

---

## ✨ Features

### 🃏 Learning Modes
| Mode | Description |
|------|-------------|
| **Flashcards** | Flip cards with smooth 3D animations to reveal pronunciations |
| **Quiz Mode** | Multiple-choice questions with instant feedback and scoring |
| **Hiragana Only** | Focus exclusively on Hiragana characters |
| **Katakana Only** | Focus exclusively on Katakana characters |
| **Mixed Mode** | Challenge yourself with both scripts at once |

### ♿ Accessibility First
NihongoFlash is built with accessibility as a core requirement, not an afterthought:
- **Full Keyboard Navigation** — Tab, Enter, Space, and Arrow keys work throughout
- **Screen Reader Support** — ARIA labels, live regions, and semantic HTML
- **Reduced Motion** — Respects `prefers-reduced-motion` user preference
- **WCAG Compliant** — Color contrast and focus indicators meet accessibility standards

### 🎯 Other Highlights
- 🔊 **Audio Pronunciation** via Web Speech API for authentic listening practice
- 📊 **Progress Tracking** with detailed learning statistics saved to Local Storage
- 🌙 **Dark Theme** optimized for extended study sessions
- 🎨 **Color-coded Scripts** — warm amber for Hiragana, cool blue for Katakana
- 📱 **Fully Responsive** — desktop, tablet, and mobile ready
- ⚡ **Blazing Fast** — Vite-powered with optimized production builds

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16 or higher
- **npm** or **yarn**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/arc-en-fel/Japanese-flashcard-website-.git
cd Japanese-flashcard-website-

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open your browser and navigate to **`http://localhost:5173`**

### Available Scripts

```bash
npm run dev       # Start development server with hot reload
npm run build     # Build optimized production bundle → /dist
npm run preview   # Preview the production build locally
```

---

## 🎮 Usage

### Flashcard Mode
1. Go to the **Learn** section and select your script mode
2. Press **Enter** or **Space** (or click) to flip a card
3. Use **← →** Arrow Keys to move between cards
4. Click the 🔊 audio button to hear the pronunciation

### Quiz Mode
1. Go to the **Quiz** section and select your mode
2. Pick the correct romaji for each character shown
3. Get instant ✅ / ❌ feedback after each answer
4. Review your final score and accuracy

### ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate between elements |
| `Enter` / `Space` | Flip card or activate button |
| `← →` Arrow Keys | Navigate between flashcards |
| `Escape` | Close modal / go back |

---

## 🗾 Kana Coverage

<details>
<summary><strong>Hiragana — 46 characters</strong> (click to expand)</summary>

| Group | Characters |
|-------|-----------|
| Vowels | あ い う え お |
| K | か き く け こ |
| S | さ し す せ そ |
| T | た ち つ て と |
| N | な に ぬ ね の |
| H | は ひ ふ へ ほ |
| M | ま み む め も |
| Y | や ゆ よ |
| R | ら り る れ ろ |
| W | わ を |
| N | ん |

</details>

<details>
<summary><strong>Katakana — 46 characters</strong> (click to expand)</summary>

Complete mirror set of the Hiragana table above in Katakana script.

</details>

---

## 📁 Project Structure

```
Japanese-flashcard-website-/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── FlashCard.tsx   # 3D flip card component
│   │   ├── QuizQuestion.tsx
│   │   ├── Navigation.tsx
│   │   └── ProgressBar.tsx
│   ├── pages/              # Route-level page components
│   │   ├── Home.tsx
│   │   ├── Learn.tsx
│   │   ├── Quiz.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAudio.ts     # Web Speech API integration
│   │   └── useProgress.ts  # Progress tracking & persistence
│   ├── data/
│   │   └── kanaData.ts     # Hiragana & Katakana character data
│   ├── types/
│   │   └── index.ts        # Shared TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
└── package.json
```

---

## 🛠️ Tech Stack

**Frontend**

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

**APIs & Tools**

![Web Speech API](https://img.shields.io/badge/Web_Speech_API-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

---

## 🧪 Code Quality

- **Fisher-Yates shuffle** for unbiased quiz question randomization
- **Dev-only data validator** — checks kana data integrity on startup with zero production impact
- **TypeScript strict mode** for a fully type-safe codebase
- Proper cleanup of timeouts and speech synthesis on component unmount
- Component-scoped transitions for optimal rendering performance

---

## 🤝 Contributing

Contributions are very welcome! Here's how to get involved:

```bash
# 1. Fork the repo and create your branch
git checkout -b feature/your-feature-name

# 2. Commit your changes with a clear message
git commit -m "feat: add your feature"

# 3. Push and open a Pull Request
git push origin feature/your-feature-name
```

Please open an issue first for major changes so we can discuss what you'd like to change.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📧 Contact

Have a suggestion, found a bug, or just want to say hi?

- 📮 **Email**: [Click Here](mailto:karthikkpradeep123@gmail.com)
- 🐛 **Bug Reports**: [Open an Issue](https://github.com/arc-en-fel/Japanese-flashcard-website-/issues)

---

<div align="center">

**Happy Learning! 頑張ってください！**
*(Ganbatte kudasai — Do your best!)*

⭐ If this project helped you, consider giving it a star!

</div>
