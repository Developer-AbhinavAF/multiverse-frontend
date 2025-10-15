import React from "react";

import LOGO_URL from "../assets/Perplexity-Comet_1745566557673_1753081300467.webp";
const REFERRAL_URL = "https://pplx.ai/abhinavdev40518";

export default function PerplexityPromoModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-[rgba(18,18,18,0.9)] shadow-2xl">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-4">
            <img src={LOGO_URL} alt="Perplexity" className="h-8 sm:h-10" />
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl font-semibold">Comet by Perplexity</h2>
              <p className="text-sm text-neutral-300">Browse at the speed of thought with an AI-powered browser</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-cyan-500/15 via-transparent to-white/5 p-4">
                <div className="aspect-video rounded-lg bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center">
                  <img src={LOGO_URL} alt="Perplexity Logo" className="h-12 opacity-90" />
                </div>
              </div>

              <div className="text-sm">
                <p className="font-medium text-cyan-200">Use this link to get 1 month of free access to Pro</p>
                <a href={REFERRAL_URL} target="_blank" rel="noreferrer" className="text-cyan-300 underline break-all">
                  {REFERRAL_URL}
                </a>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="font-semibold mb-2">Pros</h3>
                <ul className="list-disc list-inside text-sm text-neutral-300 space-y-1">
                  <li>AI assistant built into the browser</li>
                  <li>Ask questions about pages, videos, and PDFs</li>
                  <li>Fast answers with sources and citations</li>
                  <li>Great for research, note-taking, and summaries</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Cons</h3>
                <ul className="list-disc list-inside text-sm text-neutral-300 space-y-1">
                  <li>Full feature set requires sign-in</li>
                  <li>Some advanced tools are Pro-only after the first month</li>
                  <li>Best experience on desktop</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={REFERRAL_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 transition-colors w-full sm:w-auto"
                >
                  Get 1 month free
                </a>
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 hover:border-white/25 text-neutral-200 font-medium px-4 py-2 transition-colors w-full sm:w-auto"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
