# NihongoFlash - Japanese Kana Learning App

A modern, accessible web application for learning Japanese Hiragana and Katakana characters through interactive flashcards and quizzes.

![Japanese Flashcard App](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC) ![Vite](https://img.shields.io/badge/Vite-5-646CFF)

## ✨ Features

### Learning Modes
- **Interactive Flashcards**: Flip cards to reveal pronunciations with smooth 3D animations
- **Quiz Mode**: Test your knowledge with multiple-choice questions
- **Three Study Modes**: Hiragana only, Katakana only, or Mixed mode
- **Audio Pronunciation**: Web Speech API integration for authentic pronunciation practice
- **Progress Tracking**: Monitor your learning progress with detailed statistics

### Accessibility First
- ♿ **Full Keyboard Navigation**: Navigate and interact using only keyboard (Tab, Enter, Space, Arrow keys)
- 🔊 **Screen Reader Support**: ARIA labels, live regions, and semantic HTML for assistive technologies
- 🎨 **Reduced Motion Support**: Respects `prefers-reduced-motion` user preference
- 👁️ **WCAG Compliant**: Color contrast and focus indicators meet accessibility standards
- 🎯 **Focus Management**: Visible focus indicators on all interactive elements

### User Experience
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🌙 **Dark Theme**: Eye-friendly dark color scheme optimized for extended study sessions
- ⚡ **Fast & Lightweight**: Built with Vite for optimal performance
- 💾 **Local Storage**: Progress saved automatically in your browser
- 🎨 **Visual Script Differentiation**: Color-coded Hiragana (warm amber) and Katakana (cool blue)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/arc-en-fel/Japanese-flashcard-website-.git
   cd Japanese-flashcard-website-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 🎮 Usage

### Learning with Flashcards
1. Navigate to the **Learn** section
2. Select your preferred mode (Hiragana, Katakana, or Mixed)
3. Click or press **Enter/Space** to flip cards
4. Use **Arrow Keys** to navigate between cards
5. Click the audio button or press the dedicated replay button to hear pronunciation

### Taking Quizzes
1. Go to the **Quiz** section
2. Choose your quiz mode
3. Select the correct romaji pronunciation for each character
4. Get instant feedback on your answers
5. Review your score and accuracy at the end

### Keyboard Shortcuts
- **Tab**: Navigate between interactive elements
- **Enter / Space**: Flip flashcards or activate buttons
- **Arrow Left / Right**: Navigate between flashcards
- **Escape**: Close modals or return to previous state

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### Features & APIs
- **Web Speech API** - Text-to-speech pronunciation
- **Local Storage API** - Progress persistence
- **Lucide React** - Icon library

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript Compiler** - Type checking

## 📁 Project Structure

```
Japanese-flashcard-website-/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── FlashCard.tsx
│   │   ├── QuizQuestion.tsx
│   │   ├── Navigation.tsx
│   │   └── ProgressBar.tsx
│   ├── pages/           # Page components
│   │   ├── Home.tsx
│   │   ├── Learn.tsx
│   │   ├── Quiz.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useAudio.ts
│   │   └── useProgress.ts
│   ├── data/            # Kana character data
│   │   └── kanaData.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # App entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
└── package.json         # Project dependencies
```

## 🎯 Kana Coverage

### Hiragana (46 characters)
- Basic vowels: あ、い、う、え、お
- K-sounds: か、き、く、け、こ
- S-sounds: さ、し、す、せ、そ
- T-sounds: た、ち、つ、て、と
- N-sounds: な、に、ぬ、ね、の
- H-sounds: は、ひ、ふ、へ、ほ
- M-sounds: ま、み、む、め、も
- Y-sounds: や、ゆ、よ
- R-sounds: ら、り、る、れ、ろ
- W-sounds: わ、を
- N-sound: ん

### Katakana (46 characters)
- Complete mirror set of Hiragana in Katakana script

## 🧪 Development Features

### Data Validation
- **Dev-only validator**: Automatically checks kana data integrity on startup
- Detects missing fields, invalid script types, and duplicate romaji
- Fail-fast error reporting in development mode
- Zero runtime impact in production builds

### Code Quality
- Fisher-Yates shuffle for unbiased quiz question randomization
- Component-specific transitions for optimal performance
- Proper cleanup of timeouts and speech synthesis on unmount
- Type-safe codebase with TypeScript strict mode

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Japanese language educators for character data validation
- The React and Vite communities for excellent tooling
- Web Speech API for pronunciation support
- Tailwind CSS for the utility-first approach

## 📧 Contact

For questions, suggestions, or feedback:
- **Email**: hello@nihongoflash.com
- **GitHub Issues**: [Report a bug or request a feature](https://github.com/arc-en-fel/Japanese-flashcard-website-/issues)

---

**Happy Learning! 頑張ってください！(Ganbatte kudasai!)**
