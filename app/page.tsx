"use client";

import { useState, useCallback } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import ResponseForm from "@/components/ResponseForm";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  const handleVideoComplete = useCallback(() => {
    setShowForm(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-6 md:py-12">
      <div className="w-full max-w-lg mx-auto space-y-6">
        {/* Header */}
        <header className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 text-gold mb-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2v20M2 12h20" />
            </svg>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-navy leading-tight mb-2">
            Welcome
          </h1>
          <p className="text-warm-gray text-sm md:text-base max-w-sm mx-auto">
            We&apos;re so glad you&apos;re here. Watch this short message, then
            let us know how we can connect with you.
          </p>
        </header>

        {/* Video */}
        <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <VideoPlayer onVideoComplete={handleVideoComplete} />
        </section>

        {/* Form — revealed after video completes */}
        {showForm && (
          <section className="pb-12">
            <ResponseForm />
          </section>
        )}
      </div>
    </div>
  );
}
