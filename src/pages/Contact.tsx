import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-paper">
      <section className="border-b border-border bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-muted">Contact</p>
            <h1 className="mt-4 text-4xl font-semibold font-display text-ink">
              Get in <span className="text-primary-600">Touch</span>
            </h1>
            <p className="mt-4 text-lg text-muted">
              Have questions, suggestions, or need help? We'd love to hear from you. Your feedback helps us improve
              NihongoFlash for every learner.
            </p>
          </div>
        </div>
      </section>

      <div className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold text-ink mb-6">Let's Connect</h2>
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ink mb-1">Email Us</h3>
                    <p className="text-muted mb-2">Send us a message and we'll respond within 24 hours.</p>
                    <a href="mailto:hello@nihongoflash.com" className="text-primary-600 hover:text-primary-500">
                      hello@nihongoflash.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-6 border border-border shadow-soft">
                <h3 className="text-lg font-semibold text-ink mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-ink mb-1">Is NihongoFlash free?</h4>
                    <p className="text-sm text-muted">Yes! All core features are completely free to use.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-ink mb-1">Do I need to create an account?</h4>
                    <p className="text-sm text-muted">No account needed. Sign in only if you want sync across devices.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-ink mb-1">Can I use this offline?</h4>
                    <p className="text-sm text-muted">Yes. Once loaded, you can study offline and sync later.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-surface rounded-3xl p-8 border border-border shadow-soft">
                <h2 className="text-2xl font-semibold text-ink mb-6">Send us a Message</h2>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3" role="status" aria-live="polite">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="text-emerald-700 font-medium">Message sent successfully!</p>
                      <p className="text-emerald-600 text-sm">We'll get back to you soon.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-3" role="alert" aria-live="assertive">
                    <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
                    <div>
                      <p className="text-rose-700 font-medium">Failed to send message</p>
                      <p className="text-rose-600 text-sm">Please try again later.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-muted mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-paper2 border border-border rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-muted mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-paper2 border border-border rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-muted mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-paper2 border border-border rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Question</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-muted mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-paper2 border border-border rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-paper disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-paper2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold text-ink mb-4">We Value Your Feedback</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Your input helps us improve NihongoFlash for learners around the world. Share your ideas, report a bug,
            or celebrate your progress with us.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
