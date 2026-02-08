import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Volume2, Trophy, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20" />
        <div className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">
              Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Japanese</span>
            </h1>
            <p className="max-w-3xl mx-auto mb-8 text-xl text-gray-300 md:text-2xl">
              Learn Hiragana and Katakana with interactive flashcards, audio pronunciation, 
              and gamified quizzes. Make learning Japanese fun and effective!
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/learn"
                className="px-8 py-4 text-lg font-semibold text-white transition-all duration-200 transform rounded-full shadow-lg group bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <span>Start Learning</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              
              <Link
                to="/quiz"
                className="px-8 py-4 text-lg font-semibold transition-all duration-200 transform bg-transparent border-2 rounded-full border-accent-500 text-accent-400 hover:bg-accent-500 hover:text-white hover:scale-105"
              >
                Take a Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-dark-800/50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Why Choose NihongoFlash?
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-400">
              Our scientifically-designed learning system makes mastering Japanese characters 
              easier and more enjoyable than ever before.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 text-center transition-colors border bg-dark-800 rounded-2xl border-dark-700 hover:border-primary-500">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Interactive Cards</h3>
              <p className="text-gray-400">
                Beautiful flip cards with both Hiragana and Katakana characters for immersive learning.
              </p>
            </div>

            <div className="p-6 text-center transition-colors border bg-dark-800 rounded-2xl border-dark-700 hover:border-secondary-500">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl">
                <Volume2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Audio Pronunciation</h3>
              <p className="text-gray-400">
                Perfect your pronunciation with native audio for every character and word.
              </p>
            </div>

            <div className="p-6 text-center transition-colors border bg-dark-800 rounded-2xl border-dark-700 hover:border-accent-500">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Smart Quizzes</h3>
              <p className="text-gray-400">
                Adaptive quizzes that focus on characters you need to practice most.
              </p>
            </div>

            <div className="p-6 text-center transition-colors border bg-dark-800 rounded-2xl border-dark-700 hover:border-purple-500">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Progress Tracking</h3>
              <p className="text-gray-400">
                Track your learning journey with detailed progress statistics and achievements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-primary-500/10 to-secondary-500/10">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center md:grid-cols-3">
            <div>
              <div className="mb-2 text-4xl font-bold md:text-5xl text-primary-400">92</div>
              <div className="text-xl text-gray-300">Total Characters</div>
              <div className="text-sm text-gray-500">Hiragana + Katakana</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold md:text-5xl text-secondary-400">100%</div>
              <div className="text-xl text-gray-300">Audio Coverage</div>
              <div className="text-sm text-gray-500">Every character</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold md:text-5xl text-accent-400">∞</div>
              <div className="text-xl text-gray-300">Practice Modes</div>
              <div className="text-sm text-gray-500">Unlimited learning</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            Ready to Start Your Japanese Journey?
          </h2>
          <p className="mb-8 text-xl text-gray-400">
            Join thousands of learners who have mastered Japanese characters with NihongoFlash.
          </p>
          <Link
            to="/learn"
            className="inline-flex items-center px-8 py-4 space-x-2 text-lg font-semibold text-white transition-all duration-200 transform rounded-full shadow-lg bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 hover:scale-105"
          >
            <BookOpen className="w-5 h-5" />
            <span>Begin Learning Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;