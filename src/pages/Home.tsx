import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Volume2, Trophy, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="bg-paper text-ink">
      <section className="relative overflow-hidden border-b border-border bg-paper">
        <div className="absolute inset-0 bg-paper-texture opacity-80" />
        <div className="absolute inset-0 bg-warm-gradient" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-muted">NihongoFlash</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl font-display">
              Master Japanese with a calm, focused study ritual.
            </h1>
            <p className="mt-5 text-lg text-muted">
              Learn Hiragana, Katakana, dakuten, and yōon combos with a warm, paper-inspired interface, spaced repetition,
              and immersive audio.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/learn"
                className="inline-flex items-center space-x-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-600"
              >
                <span>Start Learning</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/quiz"
                className="inline-flex items-center space-x-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-ink shadow-soft transition hover:border-primary-300"
              >
                <span>Take a Quiz</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Guided Flashcards</h3>
            <p className="mt-2 text-sm text-muted">
              Beautiful cards, calm animations, and clear pronunciations for every character.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
              <Volume2 className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Audio Practice</h3>
            <p className="mt-2 text-sm text-muted">
              Listen, repeat, and learn with built-in pronunciation and listening quizzes.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Brain className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Smart Review</h3>
            <p className="mt-2 text-sm text-muted">
              Spaced repetition keeps you practicing the characters you need most.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Trophy className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Progress & Goals</h3>
            <p className="mt-2 text-sm text-muted">
              Daily goals, achievements, and study streaks keep you moving forward.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-paper2">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-surface p-6 shadow-soft">
              <div className="text-4xl font-semibold text-primary-600">210</div>
              <p className="mt-2 text-sm text-muted">Characters with full extended kana coverage.</p>
            </div>
            <div className="rounded-2xl bg-surface p-6 shadow-soft">
              <div className="text-4xl font-semibold text-secondary-600">100%</div>
              <p className="mt-2 text-sm text-muted">Audio support for every kana.</p>
            </div>
            <div className="rounded-2xl bg-surface p-6 shadow-soft">
              <div className="text-4xl font-semibold text-amber-600">4</div>
              <p className="mt-2 text-sm text-muted">Study modes: Flashcards, Review, Writing, Listening.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-surface p-10 shadow-paper">
          <h2 className="text-3xl font-semibold font-display">Ready to build a steady practice?</h2>
          <p className="mt-3 text-muted">
            Set a daily goal, review due cards, and see your progress every time you return.
          </p>
          <Link
            to="/learn"
            className="mt-6 inline-flex items-center space-x-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-600"
          >
            <BookOpen className="h-4 w-4" />
            <span>Begin Learning</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
