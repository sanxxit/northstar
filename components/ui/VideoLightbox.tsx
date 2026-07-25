"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { Play, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Optional embed URL (YouTube/Vimeo/mp4). Falls back to a stylized placeholder. */
  src?: string;
  title?: string;
};

/** Accessible film/video lightbox. ESC + backdrop click to close, locks scroll. */
export function VideoLightbox({
  open,
  onClose,
  src,
  title = "Northstar — the film",
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            className="card relative z-10 w-full max-w-4xl overflow-hidden"
            initial={{ scale: 0.94, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 10, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-line bg-black/40 text-muted transition hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-video w-full">
              {src ? (
                <iframe
                  className="h-full w-full"
                  src={src}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.28),_transparent_65%)] bg-surface-2">
                  <div className="bg-grid mask-fade absolute inset-0 opacity-40" />
                  <div className="relative flex flex-col items-center gap-4 text-center">
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-white shadow-[0_0_60px_rgba(99,102,241,0.7)]">
                      <Play className="h-7 w-7 translate-x-0.5" />
                    </span>
                    <p className="text-sm text-muted">
                      Drop your product film here — the story of one brief
                      becoming a thousand experiments.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
