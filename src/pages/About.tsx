import React from 'react';
import { BookOpen, Target, Users, Heart, Cloud } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-paper">
      <section className="border-b border-border bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-muted">About</p>
            <h1 className="mt-4 text-4xl font-semibold font-display text-ink">
              About <span className="text-primary-600">NihongoFlash</span>
            </h1>
            <p className="mt-4 text-lg text-muted">
              NihongoFlash helps learners master Hiragana and Katakana with a calm, focused experience. We blend
              spaced repetition, gentle guidance, and warm visual design to keep study sessions sustainable.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-ink mb-6">Our Mission</h2>
            <p className="text-muted mb-6">
              Learning Japanese characters can feel overwhelming. We set out to build a gentle learning environment
              that keeps progress visible and practice manageable.
            </p>
            <p className="text-muted mb-6">
              With writing practice, listening drills, and review queues that adapt to your pace, NihongoFlash turns
              repetition into meaningful rhythm.
            </p>
            <div className="flex items-center space-x-2 text-primary-600">
              <Target className="h-5 w-5" />
              <span className="font-semibold">Make Japanese accessible, one session at a time</span>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft">
            <div className="text-6xl font-bold text-center font-japanese">ひらがな</div>
            <div className="mt-3 text-center text-muted">Beautiful characters, beautifully learned.</div>
          </div>
        </div>
      </section>

      <section className="bg-paper2">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-ink">Our Values</h2>
            <p className="text-muted">The principles that guide everything we do.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-surface rounded-2xl border border-border shadow-soft">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">Education First</h3>
              <p className="text-muted text-sm">Every feature is designed to support real learning outcomes.</p>
            </div>
            <div className="text-center p-6 bg-surface rounded-2xl border border-border shadow-soft">
              <div className="w-14 h-14 mx-auto mb-4 bg-secondary-100 rounded-2xl flex items-center justify-center">
                <Users className="h-7 w-7 text-secondary-600" />
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">Community Driven</h3>
              <p className="text-muted text-sm">Built with learners in mind, guided by ongoing feedback.</p>
            </div>
            <div className="text-center p-6 bg-surface rounded-2xl border border-border shadow-soft">
              <div className="w-14 h-14 mx-auto mb-4 bg-amber-100 rounded-2xl flex items-center justify-center">
                <Cloud className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">Sync &amp; Offline</h3>
              <p className="text-muted text-sm">Use the app offline, then sync seamlessly across devices.</p>
            </div>
            <div className="text-center p-6 bg-surface rounded-2xl border border-border shadow-soft">
              <div className="w-14 h-14 mx-auto mb-4 bg-rose-100 rounded-2xl flex items-center justify-center">
                <Heart className="h-7 w-7 text-rose-600" />
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">Passion</h3>
              <p className="text-muted text-sm">Driven by love for Japanese culture and craftsmanship.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-soft">
            <h3 className="text-lg font-semibold text-ink mb-3">Responsive Design</h3>
            <p className="text-muted text-sm">
              Learn seamlessly across devices with layouts that adapt gracefully.
            </p>
          </div>
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-soft">
            <h3 className="text-lg font-semibold text-ink mb-3">Audio Integration</h3>
            <p className="text-muted text-sm">
              Clear pronunciation support using the Web Speech API.
            </p>
          </div>
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-soft">
            <h3 className="text-lg font-semibold text-ink mb-3">Progressive Web App</h3>
            <p className="text-muted text-sm">
              Installable, fast, and available offline with secure sync when you're ready.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
