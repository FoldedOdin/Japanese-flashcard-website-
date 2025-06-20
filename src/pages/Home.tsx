import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Volume2, Trophy, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Japanese</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Learn Hiragana and Katakana with interactive flashcards, audio pronunciation, 
              and gamified quizzes. Make learning Japanese fun and effective!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/learn"
                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <span className="flex items-center space-x-2">
                  <span>Start Learning</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <Link
                to="/quiz"
                className="px-8 py-4 bg-transparent border-2 border-accent-500 text-accent-400 rounded-full font-semibold text-lg hover:bg-accent-500 hover:text-white transition-all duration-200 transform hover:scale-105"
              >
                Take a Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose NihongoFlash?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our scientifically-designed learning system makes mastering Japanese characters 
              easier and more enjoyable than ever before.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-dark-800 rounded-2xl border border-dark-700 hover:border-primary-500 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Interactive Cards</h3>
              <p className="text-gray-400">
                Beautiful flip cards with both Hiragana and Katakana characters for immersive learning.
              </p>
            </div>

            <div className="text-center p-6 bg-dark-800 rounded-2xl border border-dark-700 hover:border-secondary-500 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center">
                <Volume2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Audio Pronunciation</h3>
              <p className="text-gray-400">
                Perfect your pronunciation with native audio for every character and word.
              </p>
            </div>

            <div className="text-center p-6 bg-dark-800 rounded-2xl border border-dark-700 hover:border-accent-500 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Quizzes</h3>
              <p className="text-gray-400">
                Adaptive quizzes that focus on characters you need to practice most.
              </p>
            </div>

            <div className="text-center p-6 bg-dark-800 rounded-2xl border border-dark-700 hover:border-purple-500 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Progress Tracking</h3>
              <p className="text-gray-400">
                Track your learning journey with detailed progress statistics and achievements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-primary-500/10 to-secondary-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">92</div>
              <div className="text-xl text-gray-300">Total Characters</div>
              <div className="text-sm text-gray-500">Hiragana + Katakana</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-secondary-400 mb-2">100%</div>
              <div className="text-xl text-gray-300">Audio Coverage</div>
              <div className="text-sm text-gray-500">Every character</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-accent-400 mb-2">∞</div>
              <div className="text-xl text-gray-300">Practice Modes</div>
              <div className="text-sm text-gray-500">Unlimited learning</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Japanese Journey?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of learners who have mastered Japanese characters with NihongoFlash.
          </p>
          <Link
            to="/learn"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <BookOpen className="h-5 w-5" />
            <span>Begin Learning Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;