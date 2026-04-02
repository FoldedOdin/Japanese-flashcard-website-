import React, { useEffect, useMemo, useState } from 'react';
import { Cloud, Download, Upload, User, ShieldCheck, RefreshCcw } from 'lucide-react';
import { useProgressStore } from '../hooks/useProgressStore';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useTheme } from '../hooks/useTheme';
import { QuestionType } from '../types';

const Settings: React.FC = () => {
  const { state, updateSettings, exportProgress, importProgress, resetProgress, syncWithSupabase } = useProgressStore();
  const { user, signIn, signUp, signOut, resetPassword, isSupabaseConfigured } = useSupabaseAuth();
  const { theme, setTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [importPayload, setImportPayload] = useState('');

  const exportPayload = useMemo(() => exportProgress(), [exportProgress]);

  useEffect(() => {
    if (user) {
      syncWithSupabase(user.id);
    }
  }, [user, syncWithSupabase]);

  const handleImport = () => {
    const result = importProgress(importPayload);
    if (result.success) {
      setAuthMessage('Progress imported successfully.');
    } else {
      setAuthMessage(result.error || 'Import failed.');
    }
  };

  return (
    <div className="min-h-screen bg-paper py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold font-display text-ink">Settings</h1>
          <p className="text-muted">Personalize your study flow and manage sync preferences.</p>
        </div>

        <div className="grid gap-8">
          <section className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">Study Preferences</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase text-muted">Daily Goal</label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={state.settings.dailyGoal}
                  onChange={(e) => updateSettings({ dailyGoal: Number(e.target.value) })}
                  className="mt-2 w-full rounded-xl border border-border bg-paper2 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-muted">Question Type</label>
                <select
                  value={state.settings.questionType}
                  onChange={(e) => updateSettings({ questionType: e.target.value as QuestionType })}
                  className="mt-2 w-full rounded-xl border border-border bg-paper2 px-3 py-2"
                >
                  <option value="kana_to_romaji">Kana → Romaji</option>
                  <option value="romaji_to_kana">Romaji → Kana</option>
                  <option value="audio_to_kana">Audio → Kana</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={state.settings.autoAdvance}
                  onChange={(e) => updateSettings({ autoAdvance: e.target.checked })}
                />
                <span className="text-sm text-muted">Auto-advance flashcards</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={state.settings.audioEnabled}
                  onChange={(e) => updateSettings({ audioEnabled: e.target.checked })}
                />
                <span className="text-sm text-muted">Enable pronunciation audio</span>
              </div>
              <div>
                <label className="text-xs uppercase text-muted">Quiz Timer</label>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={state.settings.quizTimerEnabled}
                    onChange={(e) => updateSettings({ quizTimerEnabled: e.target.checked })}
                  />
                  <input
                    type="number"
                    min={10}
                    max={60}
                    value={state.settings.quizTimerSeconds}
                    onChange={(e) => updateSettings({ quizTimerSeconds: Number(e.target.value) })}
                    className="w-24 rounded-xl border border-border bg-paper2 px-3 py-1"
                  />
                  <span className="text-sm text-muted">seconds</span>
                </div>
              </div>
              <div>
                <label className="text-xs uppercase text-muted">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => {
                    const nextTheme = e.target.value as 'light' | 'dark' | 'system';
                    setTheme(nextTheme);
                    updateSettings({ theme: nextTheme });
                  }}
                  className="mt-2 w-full rounded-xl border border-border bg-paper2 px-3 py-2"
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Account & Sync</h2>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Cloud className="h-4 w-4" />
                {state.sync.status === 'syncing' ? 'Syncing...' : 'Sync ready'}
              </div>
            </div>

            {!isSupabaseConfigured && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                Supabase is not configured. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable sync.
              </div>
            )}

            {user ? (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted">
                  <User className="h-4 w-4" />
                  Signed in as {user.email}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => syncWithSupabase(user.id)}
                    className="rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Sync Now
                  </button>
                  <button
                    onClick={signOut}
                    className="rounded-full border border-border bg-paper2 px-4 py-2 text-sm font-semibold text-muted"
                  >
                    Sign Out
                  </button>
                </div>
                <div className="text-xs text-muted">Last sync: {state.sync.lastSyncAt || 'Not yet synced'}</div>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs uppercase text-muted">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-paper2 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase text-muted">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-paper2 px-3 py-2"
                  />
                </div>
                <div className="flex flex-wrap gap-3 md:col-span-2">
                  <button
                    onClick={async () => {
                      try {
                        await signIn(email, password);
                        setAuthMessage('Signed in successfully.');
                      } catch {
                        setAuthMessage('Sign in failed.');
                      }
                    }}
                    className="rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await signUp(email, password);
                        setAuthMessage('Check your email to confirm your account.');
                      } catch {
                        setAuthMessage('Sign up failed.');
                      }
                    }}
                    className="rounded-full border border-border bg-paper2 px-4 py-2 text-sm font-semibold text-muted"
                  >
                    Create Account
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await resetPassword(email);
                        setAuthMessage('Password reset email sent.');
                      } catch {
                        setAuthMessage('Unable to send reset email.');
                      }
                    }}
                    className="rounded-full border border-border bg-paper2 px-4 py-2 text-sm font-semibold text-muted"
                  >
                    Reset Password
                  </button>
                </div>
                {authMessage && (
                  <div className="text-sm text-muted md:col-span-2">{authMessage}</div>
                )}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">Import & Export</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Download className="h-4 w-4" />
                  Export Progress
                </div>
                <textarea
                  readOnly
                  value={exportPayload}
                  className="mt-2 h-40 w-full rounded-2xl border border-border bg-paper2 p-3 text-xs text-muted"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Upload className="h-4 w-4" />
                  Import Progress
                </div>
                <textarea
                  value={importPayload}
                  onChange={(e) => setImportPayload(e.target.value)}
                  className="mt-2 h-40 w-full rounded-2xl border border-border bg-paper2 p-3 text-xs text-muted"
                  placeholder="Paste your progress JSON here..."
                />
                <button
                  onClick={handleImport}
                  className="mt-3 rounded-full bg-secondary-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Import
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">Reset</h2>
            <p className="mt-2 text-sm text-muted">
              This will clear local progress data. Sync before resetting if you want to keep a backup.
            </p>
            <button
              onClick={resetProgress}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-paper2 px-4 py-2 text-sm font-semibold text-muted"
            >
              <RefreshCcw className="h-4 w-4" />
              Reset Progress
            </button>
          </section>

          <section className="rounded-3xl border border-border bg-paper2 p-6 shadow-soft">
            <div className="flex items-center gap-3 text-sm text-muted">
              <ShieldCheck className="h-5 w-5 text-primary-600" />
              Guest mode keeps everything local. Sign in whenever you're ready to sync.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
