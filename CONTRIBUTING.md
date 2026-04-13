# Contributing to NihongoFlash

Thank you for your interest in contributing to NihongoFlash! We are a 100% free and open-source project committed to making Japanese learning accessible, engaging, and scientifically effective.

## Local Setup

Getting started is simple. Our backend is powered by Supabase, and the frontend is a standard Vite + React application.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/arc-en-fel/Japanese-flashcard-website-.git
   cd Japanese-flashcard-website-
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

If you plan to work on backend features, you can spin up a local Supabase instance using Docker:

```bash
supabase start
```

## Branching & Commit Strategy

1. **Branch Naming**: Please prefix your branches logically:
   - `feat/story-mode`
   - `fix/kana-city-unlock`
   - `chore/dependency-updates`
2. **Conventional Commits**: We use conventional commits. e.g., `feat: add new mnemonic generator`.
3. **Pull Requests**:
   - Please ensure your PR encompasses a single logical change.
   - Describe what problem it solves and attach screenshots if it includes UI changes.

## Areas We Need Help With

- **Good First Issues**: Check our issue tracker for `good first issue` and `help wanted` tags. This usually involves small UI fixes, accessibility improvements, or adding new Kana groupings.
- **Story Manga & Lore**: We want to add community-driven stories to our Story Mode!
- **Local AI (BYOK)**: Assisting with WebGPU, Ollama, or BYOK (Bring Your Own Key) architecture.

Thank you for helping us democratize language learning!
