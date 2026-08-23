"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

/* ------------------------------------------------------------------ */
/*  ANIMATION HELPERS                                                  */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

/* ------------------------------------------------------------------ */
/*  SECTIONS                                                           */
/* ------------------------------------------------------------------ */
const sections = [
  {
    heading: "Information We Collect",
    body: `Nectar Engine does not require user accounts. No platform credentials (logins, passwords, API keys, or session tokens) are collected or stored at any time. If you provide an email address during a purchase or for support purposes, that email is used solely for order delivery and support communication. We do not collect, store, or process any other personal information through the Product.`,
  },
  {
    heading: "How We Use Your Information",
    body: `If an email address is provided, it is used only for: (a) delivering purchase confirmations and access to the Product; (b) responding to support requests. We do not use your email for marketing, newsletters, or any purpose beyond delivery and support unless you explicitly opt in.`,
  },
  {
    heading: "How API Inputs Are Handled",
    body: `When you use the Generator or Compliance Scanner, the text you submit (affiliate-offer text for generation, promotional copy for scanning) is transmitted to Nectar Engine's server over HTTPS and processed for the requested operation. The Generator forwards your offer text to a third-party language-model provider (OpenRouter) to produce generated content. The Scanner forwards your content to a third-party language-model provider (Google Gemini) to identify platform-specific risk phrases. Neither your inputs nor the generated outputs are persisted in a database — they exist only for the duration of the request and are discarded after the response is returned. We do not retain, log, or reuse submitted content for any purpose beyond completing the request you initiated.`,
  },
  {
    heading: "Third-Party Services",
    body: `The Product uses Vercel Analytics to collect anonymous, aggregated page-view data (pages visited, general geographic region, device type). This data cannot identify you personally. No analytics data is sold to third parties. The Generator and Scanner route your input through third-party language-model providers (OpenRouter and Google Gemini respectively) under their own privacy and retention policies; those providers process your input server-side to return the generated result. Payment processing, if applicable, is handled by the applicable payment processor (Gumroad) under their own privacy policy.`,
  },
  {
    heading: "No Data Sold or Shared",
    body: `We do not sell, rent, trade, or otherwise share your personal information with third parties for their marketing or commercial purposes. We may disclose information if required by law or to protect our legal rights, but such cases would be limited to what is legally necessary.`,
  },
  {
    heading: "Cookies and Local Storage",
    body: `The Product may use browser local storage to save your preferences or session state during use (for example, counting your 3 free Generator uses). No tracking cookies from Nectar Engine are set. Third-party services (such as Vercel Analytics and Google Analytics) may set their own cookies as described in their respective privacy policies.`,
  },
  {
    heading: "Data Retention",
    body: `Nectar Engine does not persist API inputs (submitted offer text or scan content) in any database — they are processed in-memory for the request and discarded after the response is returned. Email addresses provided for purchase or support are retained only as long as necessary for order fulfillment and support purposes. Aggregate, anonymous page-view analytics are retained by Vercel Analytics per their default retention policy.`,
  },
  {
    heading: "Your Rights",
    body: `Depending on your jurisdiction, you may have the right to access or correct personal information we hold about you (such as an email provided for purchase or support). Because API inputs are not persisted, there is no stored API-input data to access or delete. To exercise your rights regarding personal information, contact us using the information provided below. We will respond within a reasonable timeframe.`,
  },
  {
    heading: "Session Data",
    body: `Each visitor receives 3 free Generator uses per browser session, tracked via browser local storage. Your generated content lives only in your browser session for the current tab. Copy or save anything you want to keep. Once you navigate away, refresh the page, or clear your browser data, your pasted offers and generated output are gone from your browser. The server-side copies of your inputs were already discarded when the request completed.`,
  },
  {
    heading: "Contact",
    body: `For privacy-related questions or requests, email us at sinaloainspireddreams@gmail.com.`,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function PrivacyPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
        <motion.p
          className="font-mono text-base tracking-widest uppercase text-electric mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Legal
        </motion.p>

        <motion.h1
          className="text-5xl sm:text-6xl font-bold tracking-tight mb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Privacy Policy
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground leading-relaxed mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Last updated: 2025
        </motion.p>

        <Separator className="bg-border/60 mb-10" />

        <div className="space-y-10">
          {sections.map((section, i) => (
            <motion.div
              key={section.heading}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              <h2 className="text-2xl font-bold tracking-tight mb-3">
                {section.heading}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {section.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
