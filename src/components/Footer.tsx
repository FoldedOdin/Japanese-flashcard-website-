import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProgressStore } from '../hooks/useProgressStore';

const Footer: React.FC = () => {
  const { state } = useProgressStore();

  const stats = useMemo(() => {
    const accuracy = state.totalSeen > 0 ? Math.round((state.totalCorrect / state.totalSeen) * 100) : 0;
    const today = new Date().toISOString().slice(0, 10);
    const todaySessions = state.studySessions.filter((session) => session.endedAt.startsWith(today));
    const todayQuestions = todaySessions.reduce((sum, session) => sum + session.totalQuestions, 0);
    return { accuracy, todayQuestions };
  }, [state]);

  return (
    <footer className="border-t border-border bg-paper2">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-lg font-semibold text-ink">NihongoFlash</div>
            <p className="mt-2 text-sm text-muted">
              Learn kana with calm focus, steady progress, and warm encouragement.
            </p>
          </div>
          <div className="text-sm text-muted">
            <div className="font-semibold text-ink">Quick Links</div>
            <div className="mt-2 flex flex-col space-y-2">
              <Link to="/learn" className="hover:text-ink">Learn</Link>
              <Link to="/quiz" className="hover:text-ink">Quiz</Link>
              <Link to="/statistics" className="hover:text-ink">Statistics</Link>
              <Link to="/settings" className="hover:text-ink">Settings</Link>
            </div>
          </div>
          <div className="text-sm text-muted">
            <div className="font-semibold text-ink">Today</div>
            <div className="mt-2">Questions answered: {stats.todayQuestions}</div>
            <div className="mt-1">Overall accuracy: {stats.accuracy}%</div>
            <div className="mt-3 text-xs text-muted">Built for focused, distraction-free practice.</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
