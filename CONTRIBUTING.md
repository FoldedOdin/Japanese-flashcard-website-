# Contributing to NihongoFlash

First off, thank you for considering contributing to NihongoFlash! It's people like you that make NihongoFlash such a great tool for everyone.

NihongoFlash is a 100% free and open-source project (AGPL-3.0) dedicated to making Japanese learning accessible, engaging, and scientifically effective.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Local Development Setup](#local-development-setup)
- [Styleguides](#styleguides)
  - [Git Commit Messages](#git-commit-messages)

## Code of Conduct

This project and everyone participating in it is governed by the [NihongoFlash Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [karthikkpradeep422@gmail.com](mailto:karthikkpradeep422@gmail.com).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for NihongoFlash. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

When you are creating a bug report, please [include as many details as possible](https://github.com/arc-en-fel/Japanese-flashcard-website-/issues/new).

> **Note:** If you find a **Security Vulnerability**, please do NOT open an issue. Email [karthikkpradeep422@gmail.com](mailto:karthikkpradeep422@gmail.com) instead.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for NihongoFlash, including completely new features and minor improvements to existing functionality.

### Pull Requests

The process described here has several goals:

- Maintain NihongoFlash's quality
- Fix bugs and deliver features faster
- Limit unnecessary work
- Increase real-time communication

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](.github/PULL_REQUEST_TEMPLATE.md) (if available).
2. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing.

## Local Development Setup

NihongoFlash is built with **React 18**, **Vite**, **TypeScript**, and **Tailwind CSS**. The backend is powered by **Supabase**.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/arc-en-fel/Japanese-flashcard-website-.git
   cd Japanese-flashcard-website-
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env.local` file with your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- We follow [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: ...` for new features
  - `fix: ...` for bug fixes
  - `docs: ...` for documentation changes
  - `style: ...` for formatting, missing semi colons, etc; no code change
  - `refactor: ...` for refactoring production code
  - `test: ...` for adding missing tests, refactoring tests; no production code change
  - `chore: ...` for updating grunt tasks etc; no production code change

---

Thank you for helping us democratize language learning! 🗾✨
