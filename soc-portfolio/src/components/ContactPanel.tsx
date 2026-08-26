'use client';

import { AnimatePresence, motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Paperclip,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { profile } from '@/data/content';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

type FormData = {
  name: string;
  email: string;
  message: string;
  file: File | null;
};

const EMPTY_FORM: FormData = {
  name: '',
  email: '',
  message: '',
  file: null,
};

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '';
const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? profile.email;

const INPUT_CLASS =
  'w-full rounded-sm border border-line bg-surface-input px-3 py-2.5 font-mono text-sm text-text outline-none transition-colors placeholder:text-dim focus:border-accent-dim focus:ring-1 focus:ring-accent/20';

const LABEL_CLASS = 'mb-1.5 block font-mono text-xs text-muted';

// EmailJS free plan caps the ENTIRE API request at ~50KB, so the
// attachment must be compressed far below that once base64-encoded.
const ATTACHMENT_TARGET_BYTES = 26 * 1024; // compressed binary budget
const ATTACHMENT_MAX_DIM = 1280; // px — longest edge before quality loop
const ATTACHMENT_INPUT_LIMIT = 10 * 1024 * 1024; // pre-compression input cap

// Resize + re-encode the image on a canvas, stepping quality down
// until the base64 output fits inside the EmailJS request budget.
function compressImage(
  file: File,
  maxDim = ATTACHMENT_MAX_DIM,
  targetBytes = ATTACHMENT_TARGET_BYTES,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);

      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported in this browser.'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.8;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);
      const maxChars = (targetBytes * 4) / 3; // base64 expands by 4/3

      while (dataUrl.length > maxChars && quality > 0.3) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image file.'));
    };

    img.src = url;
  });
}

const subscribeNoop = () => () => {};
const getMountedSnapshot = () => true;
const getMountedServerSnapshot = () => false;

export default function ContactPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [feedback, setFeedback] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // hydration-safe "client-only" flag without setState-in-effect
  // (server snapshot false, client snapshot always true)
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getMountedSnapshot,
    getMountedServerSnapshot,
  );

  const emailJsReady = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

  // clearForm and closePanel are declared before any effect/handler
  // that references them, and wrapped in useCallback so the
  // useEffect dependency array below stays stable.
  const clearForm = useCallback(() => {
    setForm(EMPTY_FORM);
    setStatus('idle');
    setFeedback('');
    if (fileRef.current) fileRef.current.value = '';
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    clearForm();
  }, [clearForm]);

  useEffect(() => {
    if (PUBLIC_KEY) emailjs.init(PUBLIC_KEY);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, closePanel]);

  const update = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (status === 'error') {
      setStatus('idle');
      setFeedback('');
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (file && !file.type.startsWith('image/')) {
      setStatus('error');
      setFeedback('Only image files are accepted.');
      e.target.value = '';
      return;
    }

    // sanity cap on the raw input — it gets compressed before sending anyway
    if (file && file.size > ATTACHMENT_INPUT_LIMIT) {
      setStatus('error');
      setFeedback('Image too large. Please use a file under 10MB.');
      e.target.value = '';
      return;
    }

    setForm((prev) => ({ ...prev, file }));
    setStatus('idle');
    setFeedback('');
  };

  const removeFile = () => {
    setForm((prev) => ({ ...prev, file: null }));
    if (fileRef.current) fileRef.current.value = '';
    setStatus('idle');
    setFeedback('');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error');
      setFeedback('All required fields must be filled.');
      return;
    }

    setStatus('loading');
    setFeedback(form.file ? 'Compressing attachment...' : 'Sending...');

    try {
      if (!emailJsReady) {
        throw new Error(
          'EmailJS not configured — check NEXT_PUBLIC_EMAILJS_* env vars',
        );
      }

      const templateParams: Record<string, unknown> = {
        from_name: form.name.trim(),
        from_email: form.email.trim(),
        message: form.message.trim(),
        reply_to: form.email.trim(),
        // aliases so the template resolves its To Email field
        // no matter which variable name it uses
        contact_email: CONTACT_EMAIL,
        to_email: CONTACT_EMAIL,
        user_email: CONTACT_EMAIL,
        email: CONTACT_EMAIL,
      };

      // compress to fit the free-plan request budget, then attach
      if (form.file) {
        const base64 = await compressImage(form.file);
        templateParams.attachment = base64;
        templateParams.attachment_name = `${form.file.name.replace(/\.[^.]+$/, '')}.jpg`;
      }

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      setStatus('success');
      setFeedback('Message sent successfully!');
      setForm(EMPTY_FORM);
      if (fileRef.current) fileRef.current.value = '';

      setTimeout(closePanel, 2000);
    } catch (err) {
      const detail =
        (err as { text?: string; message?: string })?.text ||
        (err as { message?: string })?.message ||
        '';
      console.error('EmailJS send failed:', err);
      setStatus('error');
      setFeedback(
        `Unable to send your message.${detail ? ` (${detail})` : ''} Please try again.`,
      );
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open contact form"
        title="Secure channel — contact me"
        className="group flex h-8 w-8 items-center justify-center rounded-sm border border-accent/40 bg-accent/10 text-accent transition-all duration-200 hover:border-accent hover:bg-accent/15 hover:shadow-[0_0_16px_rgba(57,255,140,0.3)] focus-visible:border-accent"
      >
        <Mail size={15} />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-20 sm:p-6 sm:pt-24"
            onClick={closePanel}
          >
            <div
              className="absolute inset-0 bg-surface-overlay backdrop-blur-md"
              aria-hidden
            />

            <motion.div
              key="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-title"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="panel relative flex w-full max-w-lg max-h-[calc(100dvh-7rem)] flex-col overflow-hidden rounded-md shadow-2xl shadow-black/50"
            >
              <div className="scanline pointer-events-none" aria-hidden />

              <div className="panel-header flex shrink-0 items-center gap-2 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
                <span className="ml-3 font-mono text-[11px] tracking-wide text-muted">
                  secure_channel.sh
                </span>
                <div className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-accent">
                  <span className="crt-dot inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  ENCRYPTED
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-dim">
                    ~/contact
                  </p>
                  <h2
                    id="contact-title"
                    className="font-mono text-base font-semibold text-text"
                  >
                    Contact Me
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Close contact form"
                  className="rounded-sm border border-line p-1.5 text-muted transition-colors hover:border-accent-dim hover:text-text"
                >
                  <X size={16} />
                </button>
              </div>

              <form
                onSubmit={onSubmit}
                className="flex flex-1 flex-col overflow-hidden"
              >
                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                  <div>
                    <label htmlFor="cp-name" className={LABEL_CLASS}>
                      Name
                    </label>
                    <input
                      id="cp-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Your name"
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label htmlFor="cp-email" className={LABEL_CLASS}>
                      Email
                    </label>
                    <input
                      id="cp-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="you@domain.com"
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label htmlFor="cp-message" className={LABEL_CLASS}>
                      Message
                    </label>
                    <textarea
                      id="cp-message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      placeholder="Your message..."
                      className={`${INPUT_CLASS} min-h-[100px] resize-none`}
                    />
                  </div>

                  <div>
                    <label htmlFor="cp-file" className={LABEL_CLASS}>
                      Attach Image
                    </label>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-line bg-surface-input px-3 py-3 font-mono text-xs text-muted transition-colors hover:border-accent-dim hover:text-accent">
                      <Paperclip size={14} />
                      {form.file ? 'Change image' : 'Choose image'}
                      <input
                        id="cp-file"
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={onFileSelect}
                      />
                    </label>
                    <p className="mt-1.5 font-mono text-[10px] text-dim">
                      auto-compressed to fit email size limits
                    </p>

                    {form.file && (
                      <div className="mt-2 flex items-center justify-between rounded-sm border border-line bg-surface-input px-3 py-2 font-mono text-xs">
                        <span className="truncate text-muted">
                          {form.file.name}
                        </span>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="ml-2 flex shrink-0 items-center gap-1 text-red transition-colors hover:text-red/80"
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="rounded-sm border border-line bg-surface-input px-3 py-2.5 font-mono text-xs">
                    {status === 'loading' && (
                      <p className="flex items-center gap-2 text-accent">
                        <Loader2 size={13} className="animate-spin" />
                        {feedback || 'Sending...'}
                      </p>
                    )}
                    {status === 'success' && (
                      <p className="flex items-center gap-2 text-accent">
                        <CheckCircle2 size={13} />
                        {feedback}
                      </p>
                    )}
                    {status === 'error' && (
                      <p className="flex items-center gap-2 text-red">
                        <AlertCircle size={13} />
                        {feedback}
                      </p>
                    )}
                    {status === 'idle' && (
                      <p className="text-dim">
                        Secure channel open — response within 24h.
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 border-t border-line bg-surface-muted px-5 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={closePanel}
                      className="rounded-sm border border-line px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-accent-dim hover:text-text"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="inline-flex items-center gap-2 rounded-sm bg-accent px-4 py-2 font-mono text-xs font-semibold text-[#06120c] transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {status === 'loading' ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      Send
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-dim">
                    <span>
                      ROUTE:{' '}
                      <span className="text-muted">{CONTACT_EMAIL}</span>
                    </span>
                    <span>
                      STATUS:{' '}
                      <span
                        className={
                          status === 'loading'
                            ? 'text-amber'
                            : status === 'success'
                              ? 'text-accent'
                              : status === 'error'
                                ? 'text-red'
                                : 'text-accent'
                        }
                      >
                        {status === 'loading'
                          ? 'SENDING'
                          : status === 'success'
                            ? 'DELIVERED'
                            : status === 'error'
                              ? 'FAILED'
                              : 'READY'}
                      </span>
                    </span>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}