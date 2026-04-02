import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Volume2, Trophy, ChevronRight, Star, Activity, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { prepare, layout as pretextLayout } from '@chenglou/pretext';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const fadeUp: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Animated text component using Pretext for layout optimization and Framer Motion for smooth transitions
const AnimatedNihongo = () => {
  const words = ['Nihongo', '日本語'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [words.length]);

  const currentWord = words[index];

  const [textWidth, setTextWidth] = useState<number | 'auto'>('auto');

  // Using Pretext to pre-calculate layout footprint for smooth layout shifting
  // This avoids DOM measurement thrashing and calculates exact pixel bounds mathematically
  useEffect(() => {
    try {
      const handle = prepare(currentWord, '600 60px Fraunces');
      const result = pretextLayout(handle, 800, 72) as { width?: number };
      if (result && typeof result.width === 'number') {
        setTextWidth(result.width);
      }
    } catch {
      // Fallback
      setTextWidth('auto');
    }
  }, [currentWord]);

  return (
    <motion.span
      layout
      animate={{ width: textWidth !== 'auto' ? textWidth + 10 : 'auto' }}
      className="inline-flex relative whitespace-nowrap text-primary-600 justify-center"
      style={{ overflow: 'hidden', verticalAlign: 'bottom' }}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={currentWord}
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
          className="inline-flex"
        >
          {currentWord.split('').map((char, i) => (
            <motion.span
              key={`${currentWord}-${i}`}
              initial={{ opacity: 0, y: 10, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, type: 'spring' }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
};

const Home: React.FC = () => {
  return (
    <div className="bg-paper text-ink relative overflow-hidden">
      {/* Decorative SVG noise layer for paper texture */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03] z-[1]" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      <section className="relative overflow-hidden border-b border-border bg-paper z-10">
        <div className="absolute inset-0 bg-paper-texture opacity-80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-warm-gradient" />
        
        {/* Decorative Floating Flashcards */}
        <div className="absolute right-[5%] top-[15%] hidden lg:block opacity-70">
          <motion.div
            animate={{ y: [-10, 10, -10], rotateZ: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="h-40 w-32 rounded-xl bg-surface shadow-paper border border-border flex items-center justify-center text-4xl font-japanese text-primary-500"
          >
            あ
          </motion.div>
          <motion.div
            animate={{ rotateY: [0, 180, 180, 0, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', times: [0, 0.2, 0.5, 0.7, 1] }}
            className="absolute -bottom-10 -left-16 h-32 w-24 rounded-xl bg-surface shadow-paper border border-border flex items-center justify-center text-3xl font-japanese text-secondary-500 transform-style-preserve-3d"
          >
            <div className="backface-hidden absolute inset-0 flex items-center justify-center">か</div>
            <div className="backface-hidden absolute inset-0 flex items-center justify-center rotate-y-180 bg-primary-50 rounded-xl">ka</div>
          </motion.div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.p variants={fadeUp} className="text-sm uppercase tracking-[0.3em] text-primary-700 font-semibold">
              NihongoFlash
            </motion.p>
            <motion.h1 variants={fadeUp} className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl font-display text-ink leading-[1.15]">
              Master <AnimatedNihongo /> <br /> with a calm, focused study ritual.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-lg text-muted/90 max-w-2xl">
              Learn Hiragana, Katakana, dakuten, and yōon combos with a warm, paper-inspired interface, spaced repetition,
              and immersive audio.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/learn"
                  className="flex items-center space-x-2 rounded-full bg-primary-500 px-7 py-3.5 text-base font-semibold text-white shadow-soft transition hover:bg-primary-600 hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]"
                >
                  <span>Start Learning</span>
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/quiz"
                  className="flex items-center space-x-2 rounded-full border-2 border-border bg-surface px-7 py-3.5 text-base font-semibold text-ink shadow-soft transition hover:border-primary-300 hover:bg-paper-2"
                >
                  <span>Take a Quiz</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Proof Section */}
      <section className="border-b border-border bg-surface z-10 relative">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center gap-6 md:gap-10 text-sm font-medium text-muted">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Users className="h-5 w-5 text-primary-500" />
              <span>Trusted by 1,000+ learners</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2"
            >
              <Star className="h-5 w-5 text-secondary-500" />
              <span>Learn 46 Hiragana in 7 days</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2"
            >
              <Activity className="h-5 w-5 text-amber-500" />
              <span>Daily streak-based system</span>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {[
            { icon: BookOpen, color: 'primary', title: 'Guided Flashcards', desc: 'Beautiful cards, calm animations, and clear pronunciations for every character.' },
            { icon: Volume2, color: 'secondary', title: 'Audio Practice', desc: 'Listen, repeat, and learn with built-in pronunciation and listening quizzes.' },
            { icon: Brain, color: 'amber', title: 'Smart Review', desc: 'Spaced repetition keeps you practicing the characters you need most.' },
            { icon: Trophy, color: 'emerald', title: 'Progress & Goals', desc: 'Daily goals, achievements, and study streaks keep you moving forward.' },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              variants={fadeUp}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="rounded-2xl border border-border bg-surface p-7 shadow-soft hover:shadow-paper transition-shadow"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-${feature.color}-100 text-${feature.color}-600`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted/90 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="border-t border-border bg-paper2 relative z-10">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-3"
          >
            {[
              { num: '210', text: 'Characters with full extended kana coverage.', color: 'primary' },
              { num: '100%', text: 'Audio support for every single kana.', color: 'secondary' },
              { num: '4', text: 'Study modes: Flashcards, Review, Writing, Listening.', color: 'amber' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className="rounded-2xl bg-surface p-8 shadow-soft border border-border/50 text-center md:text-left"
              >
                <div className={`text-5xl font-bold text-${stat.color}-600 font-display`}>{stat.num}</div>
                <p className="mt-3 text-base text-muted/90">{stat.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="rounded-3xl border border-border bg-surface p-12 md:p-16 shadow-paper text-center max-w-4xl mx-auto relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-warm-gradient opacity-50" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold font-display text-ink">Ready to build a steady practice?</h2>
            <p className="mt-4 text-lg text-muted/90 max-w-xl mx-auto">
              Set a daily goal, review due cards, and see your progress every time you return.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block mt-8">
              <Link
                to="/learn"
                className="flex items-center space-x-2 rounded-full bg-primary-500 px-8 py-4 text-base font-semibold text-white shadow-soft transition hover:bg-primary-600 hover:shadow-[0_0_20px_rgba(217,119,6,0.4)]"
              >
                <BookOpen className="h-5 w-5" />
                <span>Begin Learning</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
