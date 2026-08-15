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
    heading: "Data We Do Not Collect",
    body: `Nectar Engine does not collect: browsing history, device fingerprints, location data, payment details beyond what is processed by the payment processor, or any data entered into the Product's input fields (offer details, paste content, or generated outputs). All content you enter into the Product remains in your browser session and is not transmitted to or stored on our servers.`,
  },
  {
    heading: "Third-Party Services",
    body: `The Product may use Vercel Analytics to collect anonymous, aggregated page view data (pages visited, general geographic region, device type). This data cannot identify you personally. No analytics data is sold to third parties. Payment processing, if applicable, is handled by the applicable payment processor under their own privacy policy.`,
  },
  {
    heading: "No Data Sold or Shared",
    body: `We do not sell, rent, trade, or otherwise share your personal information with third parties for their marketing or commercial purposes. We may disclose information if required by law or to protect our legal rights, but such cases would be limited to what is legally necessary.`,
  },
  {
    heading: "Cookies and Local Storage",
    body: `The Product may use browser local storage to save your preferences or session state during use. No tracking cookies from Nectar Engine are set. Third-party services (such as Vercel Analytics) may set their own cookies as described in their respective privacy policies.`,
  },
  {
    heading: "Data Retention",
    body: `Since Nectar Engine does not collect personal data through the Product interface, there is no personal data to retain. Email addresses provided for purchase or support are retained only as long as necessary for order fulfillment and support purposes.`,
  },
  {
    heading: "Your Rights",
    body: `Depending on your jurisdiction, you may have the right to access, correct, or delete any personal information we hold about you. To exercise these rights, contact us using the information provided below. We will respond within a reasonable timeframe.`,
  },
  {
    heading: "Session Data",
    body: `Each user receives 3 free content generations. Your generated content lives only in your browser session. Copy or save anything you want to keep. Once you navigate away, refresh the page, or clear your browser data, your pasted offers and generated output are gone. We do not store your pasted offers or generated output on our servers.`,
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
