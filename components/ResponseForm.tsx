"use client";

import { useState, FormEvent } from "react";
import { getSupabase } from "@/lib/supabase";

const DESCRIBES_OPTIONS = [
  "Curious",
  "Have Questions About Faith",
  "Would Like Prayer",
  "Want to Learn More About Jesus",
  "Other",
] as const;

type DescribesOption = (typeof DESCRIBES_OPTIONS)[number];

interface FormState {
  firstName: string;
  phone: string;
  describes: DescribesOption | "";
  other: string;
  prayerRequest: string;
}

export default function ResponseForm() {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    phone: "",
    describes: "",
    other: "",
    prayerRequest: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.firstName.trim() || !form.phone.trim() || !form.describes) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.describes === "Other" && !form.other.trim()) {
      setError("Please specify your response in the Other field.");
      return;
    }

    setSubmitting(true);

    try {
      const visitType =
        form.describes === "Other"
          ? `Other: ${form.other.trim()}`
          : form.describes;

      const { error: dbError } = await getSupabase().from("visitors").insert({
        first_name: form.firstName.trim(),
        phone: form.phone.trim(),
        visit_type: visitType,
        prayer_request: form.prayerRequest.trim() || null,
      });

      if (dbError) throw dbError;

      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
      if (scriptUrl) {
        fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: form.firstName.trim(),
            phone: form.phone.trim(),
            describes: form.describes,
            other: form.describes === "Other" ? form.other.trim() : "",
            prayerRequest: form.prayerRequest.trim(),
            submittedAt: new Date().toISOString(),
          }),
        }).catch(() => {});
      }

      setSubmitted(true);
    } catch {
      setError(
        "Something went wrong sending your response. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="animate-fade-in-up text-center py-10 px-6">
        <div className="text-5xl mb-4">🙏</div>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-navy mb-3">
          Thank you {form.firstName}!
        </h2>
        <p className="text-navy-light text-base md:text-lg leading-relaxed max-w-md mx-auto">
          We&apos;re glad you&apos;re here. Someone from our team will be in
          touch soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-fade-in-up space-y-5 w-full"
    >
      <div className="text-center mb-6">
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-navy mb-2">
          We&apos;d Love to Hear From You
        </h2>
        <p className="text-warm-gray text-sm md:text-base">
          Let us know a little about yourself so we can connect.
        </p>
      </div>

      {/* First Name */}
      <div>
        <label
          htmlFor="firstName"
          className="block text-sm font-medium text-navy-light mb-1.5"
        >
          First Name <span className="text-gold">*</span>
        </label>
        <input
          id="firstName"
          type="text"
          required
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white
                     text-navy placeholder:text-warm-gray/50 text-base
                     focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold
                     transition-all duration-200"
          placeholder="Your first name"
        />
      </div>

      {/* Phone / WhatsApp */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-navy-light mb-1.5"
        >
          Phone / WhatsApp Number <span className="text-gold">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white
                     text-navy placeholder:text-warm-gray/50 text-base
                     focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold
                     transition-all duration-200"
          placeholder="+94 7X XXX XXXX"
        />
      </div>

      {/* Which Best Describes You */}
      <fieldset>
        <legend className="block text-sm font-medium text-navy-light mb-3">
          Which Best Describes You? <span className="text-gold">*</span>
        </legend>
        <div className="space-y-2.5">
          {DESCRIBES_OPTIONS.map((option) => (
            <label
              key={option}
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer
                         transition-all duration-200
                         ${
                           form.describes === option
                             ? "border-gold bg-gold/5 shadow-sm"
                             : "border-cream-dark bg-white hover:border-gold/30"
                         }`}
            >
              <input
                type="radio"
                name="describes"
                value={option}
                checked={form.describes === option}
                onChange={() => setForm({ ...form, describes: option })}
                className="sr-only"
              />
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                           transition-all duration-200
                           ${
                             form.describes === option
                               ? "border-gold"
                               : "border-warm-gray/30"
                           }`}
              >
                {form.describes === option && (
                  <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                )}
              </span>
              <span className="text-navy text-sm md:text-base">{option}</span>
            </label>
          ))}
        </div>

        {form.describes === "Other" && (
          <input
            type="text"
            value={form.other}
            onChange={(e) => setForm({ ...form, other: e.target.value })}
            className="mt-3 w-full px-4 py-3 rounded-xl border border-cream-dark bg-white
                       text-navy placeholder:text-warm-gray/50 text-base
                       focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold
                       transition-all duration-200 animate-fade-in"
            placeholder="Please tell us more..."
          />
        )}
      </fieldset>

      {/* Prayer Request */}
      <div>
        <label
          htmlFor="prayerRequest"
          className="block text-sm font-medium text-navy-light mb-1.5"
        >
          Anything You&apos;d Like Us to Pray For?{" "}
          <span className="text-warm-gray text-xs">(optional)</span>
        </label>
        <textarea
          id="prayerRequest"
          rows={3}
          value={form.prayerRequest}
          onChange={(e) => setForm({ ...form, prayerRequest: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white
                     text-navy placeholder:text-warm-gray/50 text-base resize-none
                     focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold
                     transition-all duration-200"
          placeholder="Share anything on your heart..."
        />
      </div>

      {/* Error */}
      {error && (
        <div className="animate-fade-in p-3 rounded-xl bg-error/5 border border-error/20 text-error text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 px-6 bg-navy hover:bg-navy-light disabled:opacity-60
                   text-white font-heading font-semibold text-base rounded-xl
                   transition-all duration-300 hover:shadow-md
                   focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 focus:ring-offset-cream
                   flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          "Send My Response"
        )}
      </button>
    </form>
  );
}
