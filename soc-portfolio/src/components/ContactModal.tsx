'use client';

import { AnimatePresence, motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { AlertTriangle, CheckCircle2, Mail, Paperclip, Send, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { profile } from '@/data/content';

type ModalStatus = 'idle' | 'loading' | 'success' | 'error';

type FormState = {
  name: string;
  email: string;
  message: string;
  file: File | null;
};

const initialForm: FormState = {
  name: '',
  email: '',
  message: '',
  file: null,
};

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_rzejdxz';
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || profile.email;
const isEmailJsConfigured = Boolean(serviceId && templateId && publicKey);

export default function ContactModal() {
  // Control the modal visibility and the terminal-style submission state.
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<ModalStatus>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (publicKey) {
      emailjs.init(publicKey);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
    setStatus('idle');
    setMessage('');
    setForm(initialForm);
    window.history.replaceState({}, '', '/');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus('loading');
    setMessage('Transmitting...');

    if (!isEmailJsConfigured) {
      const subject = encodeURIComponent(`Portfolio contact from ${form.name || 'anonymous'}`);
      const body = `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}\n\nAttachment: ${form.file?.name ?? 'none'}`;
      const mailtoUrl = `mailto:${contactEmail}?subject=${subject}&body=${encodeURIComponent(body)}`;

      try {
        const popup = window.open(mailtoUrl, '_blank', 'noopener,noreferrer');
        if (!popup) {
          window.location.href = mailtoUrl;
        }

        setStatus('success');
        setMessage('Draft opened in your mail app.');
        setForm(initialForm);

        window.setTimeout(() => {
          closeModal();
        }, 1400);
      } catch {
        setStatus('error');
        setMessage('Unable to open your mail app. Please try again.');
      }
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          reply_to: form.email,
          attachment: form.file
            ? [{ data: form.file, name: form.file.name, type: form.file.type }]
            : undefined,
        },
        publicKey,
      );

      setStatus('success');
      setMessage('Message received. Connection closed.');
      setForm(initialForm);

      window.setTimeout(() => {
        closeModal();
      }, 1800);
    } catch {
      setStatus('error');
      setMessage('Transmission failed. Retry connection.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (file && !file.type.startsWith('image/')) {
      setStatus('error');
      setMessage('Only image attachments are accepted.');
      event.target.value = '';
      return;
    }

    setForm((previous) => ({ ...previous, file }));
    setStatus('idle');
    setMessage('');
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.08, boxShadow: '0 0 16px rgba(57,255,140,0.45)' }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex items-center justify-center rounded-full border border-accent/50 p-2 text-accent transition-colors hover:border-accent hover:text-accent"
        aria-label="Open contact form"
      >
        <Mail size={18} className="transition-all duration-300 group-hover:drop-shadow-[0_0_10px_#00ff41]" />
      </motion.button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-xl"
            onClick={() => closeModal()}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-modal-title"
              className="relative mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-accent/50 bg-[#060b08] shadow-[0_0_30px_rgba(0,255,65,0.2)]"
            >
              <div className="border-b border-accent/20 bg-black/40 px-4 py-4 sm:px-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <div className="rounded-full border border-accent/40 bg-accent/10 p-2 text-accent">
                      <Mail size={14} />
                    </div>
                    <div>
                      <p id="contact-modal-title" className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-accent">
                        Send Message
                      </p>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-accent/70">
                        Your email will be included so I can reply.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-accent/40 p-2 text-accent transition-all hover:bg-accent/10 hover:text-accent"
                    aria-label="Close contact form"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="scanline">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,65,0.12),transparent_60%)]" />
              </div>

              <div className="relative px-4 py-5 sm:px-6 sm:py-6">
                <form className="space-y-4 font-mono text-sm" onSubmit={handleSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="mb-2 block text-[11px] uppercase tracking-[0.3em] text-accent/90">
                        Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
                        placeholder="Your name"
                        className="w-full border border-accent/40 bg-black/70 px-3 py-2 text-accent placeholder:text-accent/40 transition-all duration-200 focus:border-accent focus:bg-black focus:shadow-[0_0_0_1px_rgba(57,255,140,0.2)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="mb-2 block text-[11px] uppercase tracking-[0.3em] text-accent/90">
                        Your Email
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))}
                        placeholder="your@email.com"
                        className="w-full border border-accent/40 bg-black/70 px-3 py-2 text-accent placeholder:text-accent/40 transition-all duration-200 focus:border-accent focus:bg-black focus:shadow-[0_0_0_1px_rgba(57,255,140,0.2)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="mb-2 block text-[11px] uppercase tracking-[0.3em] text-accent/90">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={6}
                      required
                      value={form.message}
                      onChange={(event) => setForm((previous) => ({ ...previous, message: event.target.value }))}
                      placeholder="Type your message here..."
                      className="min-h-35 w-full resize-none border border-accent/40 bg-black/70 px-3 py-2 text-accent placeholder:text-accent/40 transition-all duration-200 focus:border-accent focus:bg-black focus:shadow-[0_0_0_1px_rgba(57,255,140,0.2)] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-3 rounded border border-accent/20 bg-black/40 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <label className="inline-flex cursor-pointer items-center gap-2 border border-accent/40 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-accent transition-all hover:bg-accent/10">
                      <Paperclip size={14} />
                      <span>Attach Image</span>
                      <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <div className="min-h-5 text-xs text-accent/70">
                      {form.file ? `attached: ${form.file.name}` : 'No image selected'}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-h-6 text-sm text-accent/90" aria-live="polite">
                      {status === 'loading' ? (
                        <span className="inline-flex items-center gap-2">
                          <span>Sending...</span>
                          <span className="inline-flex gap-1">
                            <span className="h-1 w-1 animate-pulse rounded-full bg-accent" />
                            <span className="h-1 w-1 animate-pulse rounded-full bg-accent [animation-delay:120ms]" />
                            <span className="h-1 w-1 animate-pulse rounded-full bg-accent [animation-delay:240ms]" />
                          </span>
                        </span>
                      ) : status === 'success' || status === 'error' ? (
                        <span className={`inline-flex items-center gap-2 ${status === 'success' ? 'text-accent' : 'text-red-400'}`}>
                          {status === 'success' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                          {message}
                        </span>
                      ) : (
                        <span className="text-accent/70">Ready to send</span>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="inline-flex items-center justify-center gap-2 border border-accent/50 bg-accent/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-accent transition-all hover:-translate-y-0.5 hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Send size={14} />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
