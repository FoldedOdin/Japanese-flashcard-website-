import React from 'react';
import { BookOpen, Target, Users, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">NihongoFlash</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Empowering learners worldwide to master Japanese characters through 
              innovative technology and engaging educational experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-300 mb-6">
                Learning Japanese can be challenging, especially when it comes to mastering 
                the intricate writing systems of Hiragana and Katakana. Traditional methods 
                often lack engagement and fail to provide the interactive experience that 
                modern learners need.
              </p>
              <p className="text-lg text-gray-300 mb-6">
                NihongoFlash was created to bridge this gap by combining proven educational 
                methodologies with cutting-edge web technology, creating an immersive and 
                enjoyable learning experience that adapts to each learner's pace and style.
              </p>
              <div className="flex items-center space-x-2 text-accent-400">
                <Target className="h-5 w-5" />
                <span className="font-semibold">Making Japanese accessible to everyone</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl p-8 border border-dark-600">
                <div className="text-6xl font-bold text-white text-center mb-4">
                  ひらがな
                </div>
                <div className="text-center text-gray-300">
                  Beautiful characters, beautifully learned
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-400">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-dark-800 rounded-2xl border border-dark-700">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Education First</h3>
              <p className="text-gray-400">
                Every feature is designed with learning effectiveness as the top priority.
              </p>
            </div>

            <div className="text-center p-6 bg-dark-800 rounded-2xl border border-dark-700">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Community Driven</h3>
              <p className="text-gray-400">
                Built by learners, for learners, with continuous feedback and improvement.
              </p>
            </div>

            <div className="text-center p-6 bg-dark-800 rounded-2xl border border-dark-700">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Accessibility</h3>
              <p className="text-gray-400">
                Free, open, and accessible learning for everyone, regardless of background.
              </p>
            </div>

            <div className="text-center p-6 bg-dark-800 rounded-2xl border border-dark-700">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Passion</h3>
              <p className="text-gray-400">
                Driven by love for Japanese culture and dedication to quality education.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 bg-dark-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Story</h2>
          </div>

          <div className="prose prose-lg prose-invert mx-auto">
            <div className="text-gray-300 space-y-6">
              <p>
                NihongoFlash began as a simple idea: what if learning Japanese characters 
                could be as engaging as playing a game? Our founders, passionate about both 
                Japanese culture and educational technology, recognized that traditional 
                flashcard methods weren't meeting the needs of modern learners.
              </p>
              
              <p>
                After months of research, user testing, and iterative design, we created 
                a platform that combines the proven effectiveness of spaced repetition 
                with beautiful, interactive interfaces and gamification elements that 
                keep learners motivated and engaged.
              </p>
              
              <p>
                Today, NihongoFlash serves thousands of learners worldwide, from complete 
                beginners taking their first steps into Japanese to advanced students 
                looking to perfect their character recognition skills. Our community 
                continues to grow, and we're constantly improving based on user feedback 
                and educational research.
              </p>
              
              <div className="bg-dark-800 rounded-lg p-6 border border-dark-700 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400 mb-2">
                    "Learning should be joyful, effective, and accessible to all."
                  </div>
                  <div className="text-gray-400">— The NihongoFlash Team</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built with Modern Technology</h2>
            <p className="text-xl text-gray-400">
              Leveraging the latest web technologies for the best learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <h3 className="text-xl font-semibold text-white mb-3">Responsive Design</h3>
              <p className="text-gray-400">
                Learn seamlessly across all devices - desktop, tablet, or mobile. 
                Your progress syncs automatically.
              </p>
            </div>
            
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <h3 className="text-xl font-semibold text-white mb-3">Audio Integration</h3>
              <p className="text-gray-400">
                Native pronunciation support using advanced text-to-speech technology 
                for accurate Japanese phonetics.
              </p>
            </div>
            
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <h3 className="text-xl font-semibold text-white mb-3">Progressive Web App</h3>
              <p className="text-gray-400">
                Fast loading, offline capability, and app-like experience right 
                in your browser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;